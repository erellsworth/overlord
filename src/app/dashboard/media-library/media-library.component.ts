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

  public editImage(image: Image, event: {
    name: string;
    alt: string;
    caption?: string;
  }): void {
    console.log('edit', image, event);
  }

  public getCaption(id?: number): string {
    if (!id) { return ''; }
    return this.media.imageCaptions[id] || '';
  }

  public handleUpload(event: FileUploadHandlerEvent): void {
    console.log('upload', event);
  }

  public loadMore(): void {
    this.media.loadMedia();
  }

  public selectImage(event: { image: Image, caption?: string }): void {
    const { caption, image } = event;
    this.media.selectedImage.next({ caption, image, position: this.config.data?.position });
    this.media.closeLibrary();
  }
}
