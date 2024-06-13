import { Component, OnInit } from '@angular/core';
import { FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';
import { MediaService } from '../../services/media.service';
import { Image } from '../../../../interfaces/media';
import { CommonModule } from '@angular/common';
import { ImageCardComponent } from './image-card/image-card.component';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-media-library',
  standalone: true,
  imports: [CommonModule, FileUploadModule, ImageCardComponent],
  templateUrl: './media-library.component.html',
  styleUrl: './media-library.component.scss'
})
export class MediaLibraryComponent implements OnInit {

  constructor(private config: DynamicDialogConfig<{
    selectedImage: Image,
    position: number
  }>, private media: MediaService) { }

  ngOnInit(): void {
    console.log('config', this.config.data);
    if (!this.media.hasInitiated) {
      this.media.loadMedia();
    }
  }

  public get mediaList(): Image[] {
    return this.media.media();
  }

  public close(): void {
    this.media.closeLibrary();
  }

  public handleUpload(event: FileUploadHandlerEvent): void {
    console.log('upload', event);
  }

  public loadMore(): void {
    this.media.loadMedia();
  }

  public selectImage(image: Image): void {
    this.media.selectedImage.next({ image, position: this.config.data?.position });
    this.media.closeLibrary();
  }
}
