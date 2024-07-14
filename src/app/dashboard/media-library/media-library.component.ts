import { Component, OnInit } from '@angular/core';
import { FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { MediaService } from '../../services/media.service';
import { Image } from '../../../../interfaces/media';
import { CommonModule } from '@angular/common';
import { ImageCardComponent } from './image-card/image-card.component';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-media-library',
  standalone: true,
  imports: [
    CommonModule,
    FileUploadModule,
    ImageCardComponent,
    PaginatorModule],
  templateUrl: './media-library.component.html',
  styleUrl: './media-library.component.scss'
})
export class MediaLibraryComponent implements OnInit {

  private currentPage = 1;

  constructor(private config: DynamicDialogConfig<{
    selectedImage: Image,
    position: number
  }>, private media: MediaService) { }

  ngOnInit(): void {
    if (!this.media.hasInitiated) {
      this.media.loadMedia(1);
    }
  }

  public get mediaList(): Image[] {
    return this.media.media()[this.currentPage];
  }

  public get total(): number {
    return this.media.totalImages;
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

  public async pageChanged(event: PaginatorState): Promise<void> {
    if (event.page) {
      await this.media.loadMedia(event.page + 1);
      this.currentPage = event.page + 1;
    }
  }

  public selectImage(event: { image: Image, caption?: string }): void {
    const { caption, image } = event;
    this.media.selectedImage.next({ caption, image, position: this.config.data?.position });
    this.media.closeLibrary();
  }
}
