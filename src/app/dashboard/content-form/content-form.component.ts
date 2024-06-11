

import { Component, Input, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { Content } from '@tiptap/core';
import { EditorComponent } from '../editor/editor.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContentInterface, ContentType, ContentTypes } from '../../../../interfaces/content';
import { Observable, map, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-content-form',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    CommonModule,
    EditorComponent,
    FloatLabelModule,
    InputTextareaModule,
    InputTextModule,
    ReactiveFormsModule],
  templateUrl: './content-form.component.html',
  styleUrl: './content-form.component.scss'
})
export class ContentFormComponent {

  public content!: ContentInterface;
  public formGroup$!: Observable<FormGroup>;

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
    }
  };

  private _contentType: ContentType = 'post';
  private _slug: string = '';

  @Input()
  set contentType(contentType: ContentType) {
    if (contentType) { this._contentType = contentType }
  }

  @Input()
  set slug(slug: string) {
    this._slug = slug;
    this.formGroup$ = this.contentService.getContentBySlug(slug).pipe(map((result) => {
      const content = result.success && result.data ? result.data : this.defaultContent;

      this.content = content;

      const formData = {
        ...content, ...{
          title: [content?.title, Validators.required],
          slug: [content?.slug, Validators.required],
          seo: this.fb.group(content?.seo || { description: '' }),
          metaData: this.fb.group(content?.metaData || {})
        }
      };

      return this.fb.group(formData);

    }));
  }

  constructor(private contentService: ContentService, private fb: FormBuilder) { }

  public get buttonText(): string {
    return this._slug ? 'Update' : 'Create';
  }

  public get contentType(): ContentType {
    const types = Object.values(ContentTypes) as ContentType[];
    return types.includes(this._contentType) ? this._contentType : 'post';
  }

  public getContent(formGroup: FormGroup): Content {
    return formGroup.value.content || formGroup.value.html;
  }

  public save(formGroup: FormGroup): void {
    console.log('save', formGroup.value.content);
  }
}
