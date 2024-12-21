import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { Crop, Image, UploadRequest } from '../../../../../interfaces/media';
import { ImageEditEvent, ImageEditorComponent } from '../image-editor/image-editor.component';
import { DialogModule } from 'primeng/dialog';
import { ImageCropperComponent } from 'ngx-image-cropper';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { slugger } from '../../../../../api/utils/misc';
import { MediaService } from '../../../services/media.service';
import { DividerModule } from 'primeng/divider';

export interface uploadedFile extends File {
  objectURL: string
}

export interface uploadForm {
  name: FormControl<string>;
  alt: FormControl<string>;
  crops: FormControl<{ [key: string]: Crop }>;
}

@Component({
    selector: 'app-uploader',
    imports: [
        ButtonModule,
        DialogModule,
        DividerModule,
        ImageCropperComponent,
        ImageEditorComponent,
        ImageModule
    ],
    templateUrl: './uploader.component.html',
    styleUrl: './uploader.component.scss'
})
export class UploaderComponent implements OnInit {
  @Input({ required: true }) file!: uploadedFile;

  @Output() upload: EventEmitter<UploadRequest> = new EventEmitter();

  public crops: { [key: string]: Crop } = {};
  public formGroup!: FormGroup<uploadForm>;
  public showEditor = false;
  public dataUrl!: string;
  public done = false;

  private uuid = uuidv4();

  constructor(private fb: FormBuilder, private media: MediaService) { }

  ngOnInit(): void {
    this.buildFormGroup();

    const reader = new FileReader();

    reader.onloadend = () => {
      this.dataUrl = reader.result as string;
    };

    try {
      reader.readAsDataURL(this.file);
    } catch (e) {
      console.error('Error reading file', e);
    }

  }

  public get image(): Image {
    const alt = this.formGroup ? this.formGroup.get('alt')?.value as string : this.file.name;
    const name = this.formGroup ? this.formGroup.get('name')?.value as string : this.sanitizedFileName(this.file.name);

    return {
      full: this.dataUrl,
      thumbnail: this.dataUrl,
      data: {
        filename: name,
        path: '',
        mimetype: this.file.type,
        name,
        alt
      }
    }
  }

  public get imageWidthClass(): string {
    return this.status.status === 'Uploaded' ? 'w-1' : 'w-4';
  }

  public get status(): {
    status: string;
    error?: string;
  } {
    const uploadStati = this.media.uploadingStatus();
    const status = uploadStati[this.uuid];

    if (!status) {
      return { status: 'Pending' };
    }
    if (status.error) {
      return {
        status: 'Failed',
        error: status.error
      }
    }

    if (status.isUploading) {
      return { status: 'Uploading' };
    }

    if (status.isUploaded) {
      return { status: 'Uploaded' };
    }

    return { status: 'Unknown' };
  }

  public cancelEdit(): void {
    this.showEditor = false;
    this.crops = {};
    this.buildFormGroup();
  }

  public saveEdit(event: ImageEditEvent): void {
    this.formGroup.get('alt')?.setValue(event.alt);
    this.formGroup.get('name')?.setValue(event.name);
    this.formGroup.get('crops')?.setValue(event.crops);
    this.showEditor = false;
  }

  public handleUpload(): void {
    this.upload.emit({
      id: this.uuid,
      file: this.file,
      alt: this.formGroup.value.alt as string,
      name: this.formGroup.value.name as string,
      crops: this.formGroup.value.crops
    });
  }

  private buildFormGroup(): void {
    this.formGroup = this.fb.group({
      name: this.fb.nonNullable.control(this.image.data.filename),
      alt: this.fb.nonNullable.control(this.image.data.alt),
      crops: this.fb.nonNullable.control(this.crops)
    });
  }

  private sanitizedFileName(name: string): string {
    return name.split('.').map(part => slugger(part)).join('.');
  }
}
