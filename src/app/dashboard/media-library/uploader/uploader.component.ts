import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { Crop, Image, UploadRequest } from '../../../../../interfaces/media';
import { ImageEditorComponent } from '../image-editor/image-editor.component';
import { DialogModule } from 'primeng/dialog';

interface uploadedFile extends File {
  objectURL: string
}

@Component({
  selector: 'app-uploader',
  standalone: true,
  imports: [
    ButtonModule,
    DialogModule,
    ImageEditorComponent,
    ImageModule
  ],
  templateUrl: './uploader.component.html',
  styleUrl: './uploader.component.scss'
})
export class UploaderComponent {
  @Input({ required: true }) file!: uploadedFile;

  @Output() upload: EventEmitter<UploadRequest> = new EventEmitter();

  public crops!: {
    full: Crop,
    thumbnail: Crop
  };

  public showEditor = false;

  public get image(): Image {
    return {
      full: this.file.objectURL,
      thumbnail: this.file.objectURL,
      data: {
        filename: this.file.name,
        path: '',
        mimetype: this.file.type,
        name: this.file.name,
        alt: this.file.name
      }
    }
  }

  public handleUpload(): void {
    this.upload.emit({
      crops: this.crops,
      file: this.file
    });
  }
}
