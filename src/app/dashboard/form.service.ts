import { computed, Injectable, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContentForm } from './content-form/content-form.interface';
import { ContentInterface } from '../../../interfaces/content';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  public contentType = computed(() => {
    return this.form().value?.type || 'post';
  });
  public form = signal<FormGroup<ContentForm>>(
    this.fb.group({} as ContentForm),
  );
  public lastSave!: string;

  constructor(private fb: FormBuilder) {}

  public prepareForm(content: ContentInterface): void {
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
          disabled: Boolean(content.slug),
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
    };

    this.form.set(this.fb.group(formData));

    this.lastSave = JSON.stringify(content.content);
  }
}