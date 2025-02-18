import { FormControl, FormGroup, UntypedFormControl } from '@angular/forms';
import { Content } from '@tiptap/core';
import { ContentStatus } from '@overlord/types';

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
    [key: string]: FormControl<any>;
  }>;
  metaData: FormGroup<{
    media_id: FormControl<number>;
    wordCount: FormControl<number>;
    [key: string]: UntypedFormControl;
  }>;
  taxonomyIds: FormControl<number[]>;
  newTaxonomies: FormControl<string[]>;
}
