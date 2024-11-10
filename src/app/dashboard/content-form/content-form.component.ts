import { Component, computed, Input, OnDestroy, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { Content } from '@tiptap/core';
import { EditorComponent } from '../editor/editor.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ContentInterface,
  ContentType,
  ContentTypes,
} from '../../../../interfaces/content';
import { Subscription, interval } from 'rxjs';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { ContentService } from '../../services/content.service';
import { ContentForm } from './content-form.interface';
import { TitleInputComponent } from './title-input/title-input.component';
import { TaxonomyInputComponent } from './taxonomy-input/taxonomy-input.component';
import { ImageSelectorComponent } from './image-selector/image-selector.component';
import { DividerModule } from 'primeng/divider';
import { ApiResponse } from '../../../../interfaces/misc';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InplaceModule } from 'primeng/inplace';
import { DropdownModule } from 'primeng/dropdown';
import { v4 as uuidv4 } from 'uuid';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { Router } from '@angular/router';

@Component({
  selector: 'app-content-form',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    ConfirmPopupModule,
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
    ToastModule,
  ],
  templateUrl: './content-form.component.html',
  styleUrl: './content-form.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class ContentFormComponent implements OnInit, OnDestroy {
  public autoSaving = false;
  public content!: ContentInterface;
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
      description: '',
    },
    metaData: {
      media_id: 0,
      wordCount: 0,
    },
    revisions: [],
  };

  private subs: Subscription[] = [];

  private _slug: string = '';

  @Input()
  set slug(slug: string) {
    this._slug = slug;
  }

  constructor(
    private confirmationService: ConfirmationService,
    private contentService: ContentService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subs.push(
      this.contentService.getContentBySlug$(this._slug).subscribe((result) => {
        const content =
          result.success && result.data ? result.data : this.defaultContent;

        this.content = content;
        const taxonomyIds = content.Taxonomies
          ? content.Taxonomies.filter((tax) => tax.id).map(
              (tax) => tax.id as number
            )
          : [];

        const formData: ContentForm = {
          id: this.fb.nonNullable.control(content.id),
          title: this.fb.nonNullable.control(
            content?.title,
            Validators.required
          ),
          slug: this.fb.nonNullable.control(
            {
              value: content?.slug,
              disabled: Boolean(this._slug),
            },
            Validators.required
          ),
          type: this.fb.nonNullable.control(content.type, Validators.required),
          status: this.fb.nonNullable.control(
            content.status,
            Validators.required
          ),
          text: this.fb.nonNullable.control(content.text),
          html: this.fb.nonNullable.control(content.html),
          content: this.fb.control(content.content, Validators.required),
          seo: this.fb.nonNullable.group(content?.seo || { description: '' }),
          metaData: this.fb.nonNullable.control(
            content?.metaData || { media_id: 0, autosave_id: uuidv4() }
          ),
          taxonomyIds: this.fb.nonNullable.control(taxonomyIds),
          newTaxonomies: this.fb.nonNullable.control([]),
          revisions: this.fb.nonNullable.control(content.revisions),
        };

        this.formGroup = this.fb.group(formData);
      })
    );

    this.subs.push(
      interval(this.autosaveInterval).subscribe(() => {
        if (this.formGroup.invalid) {
          return;
        }

        const newContent = JSON.stringify(this.formGroup.getRawValue());

        if (newContent !== this.currentContent) {
          this.currentContent = newContent;
          this.autoSave(this.formGroup.getRawValue() as ContentInterface);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  public get buttonText(): string {
    return this._slug ? 'Update' : 'Create';
  }

  public get contentType(): ContentType {
    const contentType = this.formGroup.get('type')?.value as ContentTypes;
    return contentType && this.contentTypes.includes(contentType)
      ? contentType
      : 'post';
  }

  public get contentTypes() {
    return this.contentService.contentTypeSlugs();
  }

  public async autoSave(content: ContentInterface): Promise<void> {
    //const result = await this.contentService.autoSave(content);
  }

  public async delete(event: MouseEvent): Promise<void> {
    console.log('delete');
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to delete this image?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteContent();
      },
    });
  }

  public getContent(): Content {
    return (
      (this.formGroup.value.content as Content) ||
      (this.formGroup.value.html as string)
    );
  }

  public async publish(): Promise<void> {
    this.formGroup.get('status')?.setValue('published');
    if (await this.save('Published')) {
      this.content.status = 'published';
    }
  }

  public async unpublish(): Promise<void> {
    this.formGroup.get('status')?.setValue('draft');
    if (await this.save('Unpublished')) {
      this.content.status = 'draft';
    }
  }

  public async save(action?: string): Promise<boolean> {
    if (this.formGroup.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Oh shit!',
        detail: 'Check console for form errors',
      });
      return false;
    }

    let response: ApiResponse<ContentInterface>;
    if (this._slug) {
      action = action || 'Updated';
      response = await this.contentService.updateContent(
        this.formGroup.getRawValue() as ContentInterface
      );
    } else {
      action = 'Created';
      response = await this.contentService.createContent(
        this.formGroup.getRawValue() as ContentInterface
      );
    }

    if (response.success) {
      this.messageService.add({
        severity: 'success',
        summary: 'Noice!',
        detail: `${new TitleCasePipe().transform(
          this.formGroup.value.type
        )} ${action}`,
      });
      return true;
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Oh shit!',
        detail: response.error?.message,
      });
      return false;
    }
  }

  private async deleteContent(): Promise<void> {
    const response = await this.contentService.deleteContent(
      this.content.id as number
    );

    if (response.success) {
      this.messageService.add({
        severity: 'success',
        summary: 'Buh Bye',
        detail: `${new TitleCasePipe().transform(
          this.formGroup.value.type
        )} deleted`,
      });
      this.router.navigate(['/']);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Oh shit!',
        detail: response.error?.message,
      });
    }
  }
}
