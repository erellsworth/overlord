import { Injectable, signal } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MediaLibraryComponent, SelectedImageConfig } from '../dashboard/media-library/media-library.component';
import { HttpClient } from '@angular/common/http';
import { ApiResponse, GenericResult, PaginatedApiResponse } from '../../../interfaces/misc';
import { Image, MediaCreationResult, MediaDeletionResult, MediaInterface, UploadRequest } from '../../../interfaces/media';
import { BehaviorSubject, Observable, filter, firstValueFrom } from 'rxjs';
import { ImageEditEvent } from '../dashboard/media-library/image-editor/image-editor.component';
import { NavigationEnd, Router } from '@angular/router';

interface uploadStatus {
  isUploading: boolean;
  isUploaded: boolean;
  error?: string;
};

export interface UploadingStatus {
  [key: string]: uploadStatus;
}

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  public hasInitiated = false;
  public imageCaptions: { [key: number]: string; } = {}; //TODO: This should probably be stored in the database
  public media = signal<{ [key: number]: Image[] }>({});
  public uploadingStatus = signal<UploadingStatus>({});
  public selectedImage = new BehaviorSubject({} as SelectedImageConfig);
  public totalImages = 0;

  private ref!: DynamicDialogRef;

  constructor(private http: HttpClient, private router: Router) {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(e => this.selectedImage.next({} as SelectedImageConfig));
  }

  public closeLibrary(): void {
    if (this.ref) { this.ref.close(); }
  }

  public async deleteImage(id: number): Promise<ApiResponse<MediaDeletionResult>> {
    try {
      return firstValueFrom(this.http.delete<ApiResponse<MediaDeletionResult>>(`api/media/${id}`));
    } catch (e) {
      return {
        success: false,
        error: e as Error
      }
    }
  }

  public async editImage(id: number, edit: ImageEditEvent): Promise<ApiResponse<MediaInterface>> {
    try {
      return firstValueFrom(this.http.patch<ApiResponse<MediaInterface>>(`api/media/${id}`, edit));
    } catch (e) {
      return {
        success: false,
        error: e as Error
      }
    }
  }

  public getImageById$(id: number): Observable<ApiResponse<Image>> {
    return this.http.get<ApiResponse<Image>>(`api/media/image/${id}`);
  }

  public async getValidFileName(fileName: string): Promise<string> {
    try {
      const newNameResult = await firstValueFrom(this.http.get<ApiResponse<{ validName: string }>>(
        `api/media/getValidFileName/${fileName}`
      ));

      if (newNameResult.data?.validName) {
        return newNameResult.data.validName;
      }

      return fileName;
    } catch (e) {
      console.error('error getting valid name');
      return fileName;
    }

  }

  public launchLibrary(
    service: DialogService,
    data: SelectedImageConfig
  ): void {
    this.ref = service.open(MediaLibraryComponent, { header: 'Select an Image', data });
  }

  public async loadMedia(page: number): Promise<void> {
    const result = await firstValueFrom(this.http.get<PaginatedApiResponse<Image>>(`api/media/${page}`))
    if (result.success) {
      this.media.update((media) => {
        media[page] = result.data?.contents || [];
        return media;
      });
      this.totalImages = result.data?.total as number;
      this.hasInitiated = true;
    }
  }

  public async upload(request: UploadRequest): Promise<ApiResponse<MediaCreationResult>> {

    this.updateUploadStatus(request.id, {
      isUploading: true,
      isUploaded: false
    });

    try {
      request.name = await this.getValidFileName(request.name);

      const fd = new FormData();
      fd.append('alt', request.alt);
      fd.append('crops', JSON.stringify(request.crops));
      fd.append("filename", request.name);
      fd.append("file", request.file);
      const result = await firstValueFrom(this.http.post<ApiResponse<MediaCreationResult>>("api/media/create", fd));

      if (result.success) {
        this.updateUploadStatus(request.id, {
          isUploading: false,
          isUploaded: true
        });
        return result;
      } else {
        this.updateUploadStatus(request.id, {
          isUploading: false,
          isUploaded: false,
          error: result.error?.message
        });
        return {
          success: false,
          error: result.error
        }
      }
    } catch (e) {
      this.updateUploadStatus(request.id, {
        isUploading: false,
        isUploaded: false,
        error: (e as Error).message
      });
      return {
        success: false,
        error: e as Error
      }
    }
  }

  private updateUploadStatus(id: string, status: uploadStatus): void {
    const currentStatus = this.uploadingStatus();
    currentStatus[id] = status;
    this.uploadingStatus.set(currentStatus);
  }

}
