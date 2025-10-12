import { FormControl } from '@angular/forms';
import { JSONContent } from '@tiptap/core';

export interface QuoteConfig {
  text: any;
  author?: string;
  work?: string;
  date?: string;
}

export interface QuoteForm {
  author?: FormControl<string>;
  work?: FormControl<string>;
  date?: FormControl<string>;
}
