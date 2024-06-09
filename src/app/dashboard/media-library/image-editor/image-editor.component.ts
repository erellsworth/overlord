import { Component, Input, OnInit } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { ImageModule } from 'primeng/image';
import { InplaceModule } from 'primeng/inplace';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Image } from '../../../../../interfaces/media';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-image-editor',
  standalone: true,
  imports: [
    DividerModule,
    FloatLabelModule,
    FontAwesomeModule,
    InplaceModule,
    ImageModule,
    InputTextareaModule,
    InputTextModule,
    PanelModule,
    ReactiveFormsModule
  ],
  templateUrl: './image-editor.component.html',
  styleUrl: './image-editor.component.scss'
})
export class ImageEditorComponent implements OnInit {
  @Input({ required: true }) image!: Image;

  public editIcon = faEdit;
  public formGroup!: FormGroup;
  public showEditIcon = false;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      alt: this.image.data.alt,
      caption: this.image.data.caption,
      name: this.image.data.name
    });
  }
}
