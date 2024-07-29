import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { ImageModule } from 'primeng/image';
import { InplaceModule } from 'primeng/inplace';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Crop, Image } from '../../../../../interfaces/media';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CropperComponent } from './cropper/cropper.component';

@Component({
  selector: 'app-image-editor',
  standalone: true,
  imports: [
    ButtonModule,
    CropperComponent,
    DividerModule,
    FloatLabelModule,
    FontAwesomeModule,
    ImageModule,
    InplaceModule,
    InputTextareaModule,
    InputTextModule,
    PanelModule,
    ReactiveFormsModule
  ],
  templateUrl: './image-editor.component.html',
  styleUrl: './image-editor.component.scss'
})
export class ImageEditorComponent implements OnInit, OnChanges {
  @Input() crops!: { [key: string]: Crop };
  @Input({ required: true }) image!: Image;

  @Output() saved = new EventEmitter();

  public formGroup!: FormGroup;
  public showCropper = false;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.buildFormGroup();
  }

  ngOnChanges(): void {
    this.buildFormGroup();
  }

  private buildFormGroup(): void {
    this.formGroup = this.fb.group({
      alt: this.image.data.alt,
      name: this.image.data.name
    });
  }

}
