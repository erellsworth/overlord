import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { ImageModule } from 'primeng/image';
import { InplaceModule } from 'primeng/inplace';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Crop, CropEvent, Image } from '../../../../../interfaces/media';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CropperComponent } from './cropper/cropper.component';

export interface ImageEditEvent {
  alt: string;
  name: string;
  crops: { [key: string]: Crop }
}

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
export class ImageEditorComponent implements OnInit {
  @Input({ required: true }) image!: Image;

  @Output() canceled = new EventEmitter();
  @Output() saved = new EventEmitter<ImageEditEvent>();

  public crops: { [key: string]: Crop } = {};
  public formGroup!: FormGroup;
  public showCropper = false;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.buildFormGroup();
  }

  public crop(crop: CropEvent): void {
    this.crops[crop.size] = crop.crop;
    this.formGroup.get('crops')?.setValue(this.crops);
  }

  private buildFormGroup(): void {
    this.formGroup = this.fb.group({
      name: this.image.data.filename,
      crops: this.crops,
      alt: this.image.data.alt,
    });
  }

}
