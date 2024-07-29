import { Component, Input } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { Image } from '../../../../../../interfaces/media';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-cropper',
  standalone: true,
  imports: [
    CardModule,
    ImageCropperComponent
  ],
  templateUrl: './cropper.component.html',
  styleUrl: './cropper.component.scss'
})
export class CropperComponent {
  @Input({ required: true }) image!: Image;

  public get src(): string {
    return Boolean(this.image.data.id) ? `api/getImageFromUrl?url=${this.image.full}` : this.image.full;
  }

  public cropped(event: ImageCroppedEvent, size: 'full' | 'thumb'): void {
    console.log('cropped', event, size);
  }

}