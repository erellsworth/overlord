import { Component, OnInit } from '@angular/core';
import { FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { MediaService } from '../../services/media.service';
import { Image } from '../../../../interfaces/media';
import { CommonModule } from '@angular/common';
import { ImageCardComponent } from './image-card/image-card.component';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { UploaderComponent } from './uploader/uploader.component';

export interface SelectedImageConfig {
  image?: Image,
  position?: number,
  source: 'editor' | 'selector' | 'imageCard',
  caption?: string;
}

@Component({
  selector: 'app-media-library',
  standalone: true,
  imports: [
    CommonModule,
    FileUploadModule,
    FontAwesomeModule,
    ImageCardComponent,
    PaginatorModule,
    ToastModule,
    UploaderComponent
  ],
  templateUrl: './media-library.component.html',
  styleUrl: './media-library.component.scss',
  providers: [
    MessageService
  ]
})
export class MediaLibraryComponent implements OnInit {

  public uploadIcon = faUpload;

  private currentPage = 1;

  constructor(
    private config: DynamicDialogConfig<SelectedImageConfig>,
    private media: MediaService,
    private messageService: MessageService
  ) { }

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

  public async getTempImage(file: any): Promise<Image> {
    const filename = await this.media.getValidFileName(file.name);
    return {
      full: file.objectURL,
      thumbnail: file.objectURL,
      data: {
        filename,
        path: 'string',
        mimetype: file.type,
        name: filename,
        alt: filename
      }
    }
  }

  public handleUpload(event: FileUploadHandlerEvent): void {
    event.files.forEach(async (file) => {
      const result = await this.media.upload(file);
      if (result.success && result.image) {
        this.media.media()[0].push(result.image);

        this.messageService.add({
          severity: 'success',
          summary: 'Uploaded!',
          detail: `${result.image.data.filename} added to media library`
        });
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Uploaded failed',
          detail: result.error?.message
        });
      }
    });
  }

  public async pageChanged(event: PaginatorState): Promise<void> {
    if (event.page) {
      await this.media.loadMedia(event.page + 1);
      this.currentPage = event.page + 1;
    }
  }

  public selectImage(event: { image: Image, caption?: string }): void {
    if (!this.config.data) { return; }
    const { caption, image } = event;
    const { position, source } = this.config.data;
    this.media.selectedImage.next({ caption, image, position, source });
    this.media.closeLibrary();
  }
}
