import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Textarea } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { Content } from '@tiptap/core';
import { EditorComponent } from '../editor/editor.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ContentInterface } from '../../../../interfaces/content';
import { firstValueFrom, Subscription, timer } from 'rxjs';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { ContentService } from '../../services/content.service';
import { TitleInputComponent } from './title-input/title-input.component';
import { TaxonomyInputComponent } from './taxonomy-input/taxonomy-input.component';
import { ImageSelectorComponent } from './image-selector/image-selector.component';
import { DividerModule } from 'primeng/divider';
import { ApiResponse } from '../../../../interfaces/misc';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InplaceModule } from 'primeng/inplace';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { Router } from '@angular/router';
import { FormService } from '../form.service';
import { Select } from 'primeng/select';
import { OverlordField } from '../../../../interfaces/overlord.config';
import { TextInputComponent } from './text-input/text-input.component';
import { StringInputComponent } from './string-input/string-input.component';

@Component({
  selector: 'app-content-form',
  imports: [
    ButtonModule,
    CardModule,
    ConfirmPopupModule,
    CommonModule,
    DividerModule,
    EditorComponent,
    FloatLabelModule,
    ImageSelectorComponent,
    InplaceModule,
    InputTextModule,
    ReactiveFormsModule,
    Select,
    StringInputComponent,
    TaxonomyInputComponent,
    Textarea,
    TextInputComponent,
    TitleInputComponent,
    ToastModule,
    TextInputComponent,
  ],
  templateUrl: './content-form.component.html',
  styleUrl: './content-form.component.scss',
  providers: [ConfirmationService, MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentFormComponent implements OnInit, OnDestroy {
  public saveIndicator = '';

  private autosaveDelay = 1000 * 5; // autosave 5 seconds after typing stops
  private autosaveTimeOut!: ReturnType<typeof setTimeout>;
  private isSaving = false;
  private lastSave!: string;
  private minAutoSaveWordCount = 30; //TODO: get these values from database
  private subs: Subscription[] = [];

  constructor(
    private confirmationService: ConfirmationService,
    private contentService: ContentService,
    private formService: FormService,
    private messageService: MessageService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const autoSaveSub = this.formGroup
      .get('content')
      ?.valueChanges.subscribe(() => this.startAutosaveTimer());
    if (autoSaveSub) {
      this.subs.push(autoSaveSub);
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  public get buttonText(): string {
    return this.isNew ? 'Create' : 'Update';
  }

  public get contentTypeSlug(): string {
    return this.formService.contentType();
  }

  public get contentType() {
    return this.contentService.getContentTypeBySlug(this.contentTypeSlug);
  }

  public get contentTypes(): string[] {
    return this.contentService.contentTypeSlugs();
  }

  public get formGroup() {
    return this.formService.form();
  }

  public get isNew(): boolean {
    return !Boolean(this.formGroup.get('id')?.value);
  }

  public get showTitle(): boolean {
    return !Boolean(this.contentType?.noTitle);
  }

  public get status(): string {
    return this.formGroup.get('status')?.value as string;
  }

  public get fields(): OverlordField[] {
    return this.contentType ? (this.contentType.fields as OverlordField[]) : [];
  }

  public get formTitle(): string {
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
      message: `Are you sure you want to delete this ${this.contentTypeSlug}?`,
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
    await this.save('Published');
  }

  public async unpublish(): Promise<void> {
    this.formGroup.get('status')?.setValue('draft');
    await this.save('Unpublished');
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
    if (this.isNew) {
      action = 'Created';
      this.saveIndicator = 'Saving...';
      response = await this.contentService.createContent(content);
    } else {
      action = action || 'Updated';
      this.saveIndicator = 'Updating...';
      response = await this.contentService.updateContent(content);
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
    const saved = await this.contentService.autoSave(autoSave);
    if (saved.success) {
      this.formGroup.get('id')?.setValue(saved.data?.id);
      this.formGroup.get('slug')?.setValue(saved.data?.slug as string);
    }

    this.isSaving = false;
    this.dismisIndicator();
  }

  private async deleteContent(): Promise<void> {
    const id = this.formGroup.get('id')?.value;

    if (!id) {
      return;
    }
    const response = await this.contentService.deleteContent(id);

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
}
