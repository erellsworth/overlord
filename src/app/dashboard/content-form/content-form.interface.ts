import { FormControl, FormGroup } from '@angular/forms';
import { Content } from '@tiptap/core';
import { ContentBase, ContentStatus } from '../../../../interfaces/content';

export interface ContentForm {
  id?: FormControl<number | undefined>;
  slug: FormControl<string>;
  title: FormControl<string>;
  type: FormControl<string>;
  status: FormControl<ContentStatus>;
  text: FormControl<string>;
  html: FormControl<string>;
  content: FormControl<Content>;
  seo: FormGroup<{
    description: FormControl<string>;
    [key: string]: FormControl<string>;
  }>;
  metaData: FormControl<{ [key: string]: any }>;
  taxonomyIds: FormControl<number[]>;
  newTaxonomies: FormControl<string[]>;
  revisions: FormControl<ContentBase[]>;
}
