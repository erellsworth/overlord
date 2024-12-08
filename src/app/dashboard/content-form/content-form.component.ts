import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';
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
import { ContentInterface } from '../../../../interfaces/content';
import { firstValueFrom, timer } from 'rxjs';
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
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { Router } from '@angular/router';
import { ConfigService } from '../../services/config.service';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentFormComponent {
  public content!: ContentInterface;
  public formGroup!: FormGroup<ContentForm>;
  public isSaving = false;
  public saveIndicator = '';

  private autosaveDelay = 1000 * 5; // autosave 5 seconds after typing stops
  private minAutoSaveWordCount = 30; //TODO: get these values from database
  private lastSave!: string;
  private autosaveTimeOut!: ReturnType<typeof setTimeout>;

  private _contentType!: string;
  private _slug: string = '';

  @Input()
  set slug(slug: string) {
    this._slug = slug;
    if (slug) {
      this.prepareForm();
    }
  }

  get slug(): string {
    return this._slug;
  }

  @Input()
  set contentType(type: string) {
    this._contentType = type;
    if (!this.slug) {
      this.prepareForm();
    }
  }

  get contentType(): string {
    return this._contentType || 'post';
  }

  constructor(
    private configService: ConfigService,
    private confirmationService: ConfirmationService,
    private contentService: ContentService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router,
  ) { }

  public get buttonText(): string {
    return this._slug ? 'Update' : 'Create';
  }

  public get contentTypes(): string[] {
    return this.contentService.contentTypeSlugs();
  }

  public get fields(): string[] {
    return this.configService.getActiveFields(this.contentType);
  }

  public get showTitle(): boolean {
    return !Boolean(
      this.configService.config().contentTypes[this.contentType]?.noTitle,
    );
  }

  public get title(): string {
    return this.formGroup.get('title')?.value || '';
  }

  private get shouldAutosave(): boolean {
    const values = this.formGroup.getRawValue();
    return Boolean(
      values.title &&
      values.metaData.wordCount &&
      values.metaData.wordCount > this.minAutoSaveWordCount &&
      JSON.stringify(values.content) !== this.lastSave,
    );
  }

  public async delete(event: MouseEvent): Promise<void> {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Are you sure you want to delete this ${this.contentType}?`,
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
      //TODO: display errors on screen
      console.log('error', this.formGroup);
      this.messageService.add({
        severity: 'error',
        summary: 'Oh shit!',
        detail: 'Check console for form errors',
      });
      return false;
    }

    let response: ApiResponse<ContentInterface>;
    const content = this.formGroup.getRawValue();
    this.isSaving = true;
    if (this._slug) {
      action = action || 'Updated';
      this.saveIndicator = 'Updating...';
      response = await this.contentService.updateContent(content);
    } else {
      action = 'Created';
      this.saveIndicator = 'Saving...';
      response = await this.contentService.createContent(content);
    }

    this.isSaving = false;

    this.dismisIndicator();
    if (response.success) {
      this.lastSave = JSON.stringify(content);
      this.messageService.add({
        severity: 'success',
        summary: 'Noice!',
        detail: `${new TitleCasePipe().transform(
          this.formGroup.value.type,
        )} ${action}`,
      });
      this.router.navigate(['edit', response.data?.slug as string]);
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

  public showField(field: string): boolean {
    return this.configService.isFieldActive(this.contentType, field);
  }

  public startAutosaveTimer(): void {
    clearTimeout(this.autosaveTimeOut);

    this.autosaveTimeOut = setTimeout(async () => {
      clearTimeout(this.autosaveTimeOut);
      this.autoSave();
    }, this.autosaveDelay);
  }

  private async autoSave(): Promise<void> {
    if (!this.shouldAutosave) {
      return;
    }

    if (this.isSaving) {
      await firstValueFrom(timer(this.autosaveDelay));
      return this.autoSave();
    }

    this.isSaving = true;
    this.saveIndicator = 'Autosaving...';

    const autoSave = this.formGroup.getRawValue();
    this.lastSave = JSON.stringify(autoSave.content);
    await this.contentService.autoSave(autoSave);

    this.isSaving = false;
    this.dismisIndicator();
  }

  private async deleteContent(): Promise<void> {
    const response = await this.contentService.deleteContent(
      this.content.id as number,
    );

    if (response.success) {
      this.messageService.add({
        severity: 'success',
        summary: 'Buh Bye',
        detail: `${new TitleCasePipe().transform(
          this.formGroup.value.type,
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

  private async dismisIndicator(): Promise<void> {
    await firstValueFrom(timer(1000));

    this.saveIndicator = '';
  }

  private async prepareForm(): Promise<void> {
    const content = this.contentService.activeContent();

    if (this.slug) {
      this.contentType = content.type;
    }

    this.content = content;
    const taxonomyIds = content.Taxonomies
      ? content.Taxonomies.filter((tax) => tax.id).map(
        (tax) => tax.id as number,
      )
      : [];

    const formData: ContentForm = {
      id: this.fb.nonNullable.control(content.id),
      title: this.fb.nonNullable.control(content.title, Validators.required),
      slug: this.fb.nonNullable.control(
        {
          value: content.slug,
          disabled: Boolean(this._slug),
        },
        Validators.required,
      ),
      type: this.fb.nonNullable.control(content.type, Validators.required),
      status: this.fb.nonNullable.control(content.status, Validators.required),
      text: this.fb.nonNullable.control(content.text),
      html: this.fb.nonNullable.control(content.html),
      content: this.fb.control(content.content),
      seo: this.fb.nonNullable.group(content?.seo || { description: '' }),
      metaData: this.fb.nonNullable.control(
        content?.metaData || { media_id: 0 },
      ),
      taxonomyIds: this.fb.nonNullable.control(taxonomyIds),
      newTaxonomies: this.fb.nonNullable.control([]),
      revisions: this.fb.nonNullable.control(content.Revisions || []),
    };

    this.formGroup = this.fb.group(formData);

    this.lastSave = JSON.stringify(content.content);
  }
}
