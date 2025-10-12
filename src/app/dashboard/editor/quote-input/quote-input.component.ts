import { Component, OnDestroy, OnInit } from '@angular/core';
import { QuoteConfig, QuoteForm } from './quote-input.interface';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Content, Editor, JSONContent } from '@tiptap/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TextareaModule } from 'primeng/textarea';
import { InputTextModule } from 'primeng/inputtext';
import { TiptapEditorDirective } from 'ngx-tiptap';
import StarterKit from '@tiptap/starter-kit';

@Component({
  selector: 'app-quote-input',
  imports: [
    ButtonModule,
    DividerModule,
    FloatLabelModule,
    InputTextModule,
    ReactiveFormsModule,
    TextareaModule,
    TiptapEditorDirective,
  ],
  templateUrl: './quote-input.component.html',
  styleUrl: './quote-input.component.scss',
})
export class QuoteInputComponent implements OnInit, OnDestroy {
  public formGroup!: FormGroup<QuoteForm>;
  public editor!: Editor;

  constructor(
    private config: DynamicDialogConfig<QuoteConfig>,
    private fb: FormBuilder,
    private ref: DynamicDialogRef,
  ) {}

  ngOnInit(): void {
    console.log('config', this.config.data?.text);
    const text: any = this.config.data?.text || [];
    const author: string = this.config.data?.author || '';
    const work: string = this.config.data?.work || '';
    const date: string = this.config.data?.date || '';
    console.log('text', text);

    this.editor = new Editor({
      extensions: [StarterKit],
      content: { type: 'doc', content: text },
    });

    const formGroup: QuoteForm = {
      author: this.fb.nonNullable.control(author),
      work: this.fb.nonNullable.control(work),
      date: this.fb.nonNullable.control(date),
    };

    this.formGroup = this.fb.group(formGroup);
  }

  ngOnDestroy(): void {
    this.editor?.destroy();
  }

  public insertQuote(): void {
    this.ref.close({
      ...this.formGroup.value,
      ...{
        text: this.editor.getJSON(),
      },
    });
  }

  public removeLink(): void {
    this.ref.close();
  }
}
