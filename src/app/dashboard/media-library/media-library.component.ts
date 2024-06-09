import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';
import { MediaService } from '../../services/media.service';
import { Image } from '../../../../interfaces/media';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ImageCardComponent } from './image-card/image-card.component';

@Component({
  selector: 'app-media-library',
  standalone: true,
  imports: [CommonModule, FileUploadModule, ImageCardComponent],
  templateUrl: './media-library.component.html',
  styleUrl: './media-library.component.scss'
})
export class MediaLibraryComponent implements OnInit {

  private subs: Subscription[] = [];

  constructor(private media: MediaService) { }

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

  public handleUpload(event: FileUploadHandlerEvent): void {
    console.log('upload', event);
  }

  public loadMore(): void {
    this.media.loadMedia();
  }

  public selectImage(image: Image): void {
    this.media.selectedImage.next(image);
    this.media.closeLibrary();
  }
}
