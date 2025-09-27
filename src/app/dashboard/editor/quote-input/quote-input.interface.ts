import { FormControl } from '@angular/forms';

export interface QuoteConfig {
  text: string;
  author?: string;
  work?: string;
  date?: string;
}

export interface QuoteForm {
  text: FormControl<string>;
  author?: FormControl<string>;
  work?: FormControl<string>;
  date?: FormControl<string>;
}
