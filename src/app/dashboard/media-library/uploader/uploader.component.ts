import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { Crop, UploadRequest } from '../../../../../interfaces/media';

interface uploadedFile extends File {
  objectURL: string
}

@Component({
  selector: 'app-uploader',
  standalone: true,
  imports: [
    ButtonModule,
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

  public handleUpload(): void {
    this.upload.emit({
      crops: this.crops,
      file: this.file
    });
  }

  public showCropper(): void {

  }
}
