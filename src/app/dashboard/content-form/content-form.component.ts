

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { Content } from '@tiptap/core';
import { EditorComponent } from '../editor/editor.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContentInterface, ContentType, ContentTypes } from '../../../../interfaces/content';
import { Subscription, firstValueFrom, interval } from 'rxjs';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { ContentService } from '../../services/content.service';
import { ContentForm } from './content-form.interface';
import { TitleInputComponent } from './title-input/title-input.component';
import { TaxonomyInputComponent } from './taxonomy-input/taxonomy-input.component';
import { ImageSelectorComponent } from './image-selector/image-selector.component';
import { DividerModule } from 'primeng/divider';
import { ApiResponse } from '../../../../interfaces/misc';
import { MessageService } from 'primeng/api';
import { InplaceModule } from 'primeng/inplace';
import { DropdownModule } from 'primeng/dropdown';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-content-form',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    CommonModule,
    DividerModule,
    DropdownModule,
    EditorComponent,
    FloatLabelModule,
    ImageSelectorComponent,
    InplaceModule,
    InputTextareaModule,
    InputTextModule,
    ReactiveFormsModule,
    TaxonomyInputComponent,
    TitleInputComponent,
    ToastModule
  ],
  templateUrl: './content-form.component.html',
  styleUrl: './content-form.component.scss',
  providers: [
    MessageService
  ]
})
export class ContentFormComponent implements OnInit, OnDestroy {

  public autoSaving = false;
  public content!: ContentInterface;
  public contentTypes = Object.values(ContentTypes); // TODO: get from service
  public formGroup!: FormGroup<ContentForm>;

  private autosaveInterval = 1000 * 30; // every 30 seconds
  private currentContent!: string;

  private defaultContent: ContentInterface = {
    title: '',
    type: 'post',
    slug: '',
    status: 'draft',
    text: '',
    html: '',
    content: null,
    seo: {
      description: ''
    },
    metaData: {
      media_id: 0
    }
  };

  private subs: Subscription[] = [];

  private _slug: string = '';

  @Input()
  set slug(slug: string) {
    this._slug = slug;
  }

  constructor(
    private contentService: ContentService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.subs.push(this.contentService.getContentBySlug$(this._slug).subscribe(result => {
      const content = result.success && result.data ? result.data : this.defaultContent;

      this.content = content;
      const taxonomyIds = content.Taxonomies ? content.Taxonomies.filter(tax => tax.id).map(tax => tax.id as number) : [];

      const formData: ContentForm = {
        id: this.fb.nonNullable.control(content.id),
        title: this.fb.nonNullable.control(content?.title, Validators.required),
        slug: this.fb.nonNullable.control({
          value: content?.slug,
          disabled: Boolean(this._slug)
        }, Validators.required),
        type: this.fb.nonNullable.control(content.type, Validators.required),
        status: this.fb.nonNullable.control(content.status, Validators.required),
        text: this.fb.nonNullable.control(content.text),
        html: this.fb.nonNullable.control(content.html),
        content: this.fb.control(content.content, Validators.required),
        seo: this.fb.nonNullable.group(content?.seo || { description: '' }),
        metaData: this.fb.nonNullable.group(content?.metaData || { media_id: 0, autosave_id: uuidv4() }),
        taxonomyIds: this.fb.nonNullable.control(taxonomyIds),
        newTaxonomies: this.fb.nonNullable.control([])
      };

      this.formGroup = this.fb.group(formData);
    }));

    this.subs.push(interval(this.autosaveInterval).subscribe(() => {
      if (this.formGroup.invalid) {
        return;
      }

      const newContent = JSON.stringify(this.formGroup.getRawValue());

      if (newContent !== this.currentContent) {
        this.currentContent = newContent;
        this.autoSave(this.formGroup.getRawValue() as ContentInterface);
      }

    }));
  }


  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  public get buttonText(): string {
    return this._slug ? 'Update' : 'Create';
  }

  public getContentType(formGroup: FormGroup): ContentType {
    const contentType = formGroup.get('type')?.value;
    return this.contentTypes.includes(contentType) ? contentType : 'post';
  }

  public getContent(formGroup: FormGroup): Content {
    return formGroup.value.content || formGroup.value.html;
  }

  public async publish(formGroup: FormGroup): Promise<void> {
    formGroup.get('status')?.setValue('published');
    if (await this.save(formGroup, 'Published')) {
      this.content.status = 'published';
    }
  }

  public async unpublish(formGroup: FormGroup): Promise<void> {
    formGroup.get('status')?.setValue('draft');
    if (await this.save(formGroup, 'Unpublished')) {
      this.content.status = 'draft';
    }
  }

  public async save(formGroup: FormGroup, action?: string): Promise<boolean> {

    if (formGroup.invalid) {
      console.error('save error', formGroup);
      this.messageService.add({
        severity: 'error',
        summary: 'Oh shit!',
        detail: 'Check console for form errors'
      });
      return false;
    }

    let response: ApiResponse<ContentInterface>;
    if (this._slug) {
      action = action || 'Updated';
      response = await firstValueFrom(this.contentService.updateContent$(formGroup.getRawValue()));
    } else {
      action = 'Created';
      response = await firstValueFrom(this.contentService.createContent$(formGroup.getRawValue()));
    }

    if (response.success) {
      this.messageService.add({
        severity: 'success',
        summary: 'Noice!',
        detail: `${new TitleCasePipe().transform(formGroup.value.type)} ${action}`
      });
      return true;
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Oh shit!',
        detail: response.error?.message
      });
      return false;
    }
  }

  public async autoSave(content: ContentInterface): Promise<void> {
    const result = await this.contentService.autoSave(content);
  }
}
