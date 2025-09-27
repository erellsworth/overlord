import { Component, OnInit } from '@angular/core';
import { QuoteConfig, QuoteForm } from './quote-input.interface';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TextareaModule } from 'primeng/textarea';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-quote-input',
  imports: [
    ButtonModule,
    DividerModule,
    FloatLabelModule,
    InputTextModule,
    ReactiveFormsModule,
    TextareaModule,
  ],
  templateUrl: './quote-input.component.html',
  styleUrl: './quote-input.component.scss',
})
export class QuoteInputComponent implements OnInit {
  public formGroup!: FormGroup<QuoteForm>;

  constructor(
    private config: DynamicDialogConfig<QuoteConfig>,
    private fb: FormBuilder,
    private ref: DynamicDialogRef,
  ) {}

  ngOnInit(): void {
    console.log('config', this.config.data?.text);
    const text: string = this.config.data?.text || '';
    const author: string = this.config.data?.author || '';
    const work: string = this.config.data?.work || '';
    const date: string = this.config.data?.date || '';

    const formGroup: QuoteForm = {
      text: this.fb.nonNullable.control(text, Validators.required),
      author: this.fb.nonNullable.control(author),
      work: this.fb.nonNullable.control(work),
      date: this.fb.nonNullable.control(date),
    };

    this.formGroup = this.fb.group(formGroup);
  }

  public insertQuote(): void {
    this.ref.close(this.formGroup.value);
  }

  public removeLink(): void {
    this.ref.close();
  }
}
