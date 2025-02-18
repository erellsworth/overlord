import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { CropEvent, Image } from '@overlord/types';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'app-cropper',
  imports: [CardModule, ImageCropperComponent, ImageModule],
  templateUrl: './cropper.component.html',
  styleUrl: './cropper.component.scss',
})
export class CropperComponent {
  @Input({ required: true }) image!: Image;
  @Output() imageCropped = new EventEmitter<CropEvent>();

  public get src(): string {
    if (!this.image) {
      return '';
    }
    return this.image.full; //Boolean(this.image.data.id) ? `api/getImageFromUrl?url=${this.image.full}` : this.image.full;
  }

  public cropped(event: ImageCroppedEvent, size: CropEvent['size']): void {
    const { height, width } = event;
    const left = Math.round(event.cropperPosition.x1);
    const top = Math.round(event.cropperPosition.y1);
    this.imageCropped.emit({
      size,
      crop: {
        left,
        top,
        width,
        height,
      },
    });
  }
}
