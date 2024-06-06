import { Component, Input, OnInit, input } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { EditorComponent } from '../editor/editor.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ContentInterface } from '../../../../interfaces/content';

@Component({
  selector: 'app-content-form',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    EditorComponent,
    FloatLabelModule,
    InputTextModule,
    ReactiveFormsModule],
  templateUrl: './content-form.component.html',
  styleUrl: './content-form.component.scss'
})
export class ContentFormComponent implements OnInit {

  @Input() data: ContentInterface = {
    title: '',
    type: 'post',
    slug: '',
    status: 'draft',
    text: '',
    html: '',
    content: {},
    seo: {
      description: ''
    },
    metaData: {
    }
  };

  public formGroup!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.formGroup = this.fb.group(this.data);
  }

  public get buttonText(): string {
    return 'Save';
  }

  public save(): void {
    console.log('save', this.formGroup.value);
  }
}
