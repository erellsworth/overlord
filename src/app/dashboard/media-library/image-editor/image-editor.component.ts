import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
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
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-image-editor',
  standalone: true,
  imports: [
    ButtonModule,
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
export class ImageEditorComponent implements OnInit, OnChanges {
  @Input({ required: true }) image!: Image;

  @Output() saved = new EventEmitter();

  public editIcon = faEdit;
  public formGroup!: FormGroup;
  public showEditIcon = false;

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
