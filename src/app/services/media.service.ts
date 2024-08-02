import { Injectable, signal } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MediaLibraryComponent, SelectedImageConfig } from '../dashboard/media-library/media-library.component';
import { HttpClient } from '@angular/common/http';
import { ApiResponse, GenericResult, PaginatedApiResponse } from '../../../interfaces/misc';
import { Image, MediaCreationResult, UploadRequest } from '../../../interfaces/media';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';

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

  constructor(private http: HttpClient) { }

  public closeLibrary(): void {
    if (this.ref) { this.ref.close(); }
  }

  public getImageById$(id: number): Observable<ApiResponse<Image>> {
    return this.http.get<ApiResponse<Image>>(`api/media/image/${id}`);
  }

  public async getValidFileName(fileName: string): Promise<string> {
    const newNameResult = await firstValueFrom(this.http.get<ApiResponse<{ validName: string }>>(
      `api/media/getValidFileName/${__filename}`
    ));

    if (newNameResult.data?.validName) {
      return newNameResult.data.validName;
    }

    return fileName;
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

      const newNameResult = await firstValueFrom(this.http.get<ApiResponse<{ validName: string }>>(
        `api/media/getValidFileName/${request.name}`
      ));

      if (newNameResult.success) {
        request.name = newNameResult.data?.validName as string;
      } else {
        this.updateUploadStatus(request.name, {
          isUploading: false,
          isUploaded: false,
          error: newNameResult.error?.message
        });
        return newNameResult as GenericResult;
      }

      const fd = new FormData();
      fd.append('alt', request.alt);
      fd.append('crops', JSON.stringify(request.crops));
      fd.append("filename", request.name);
      fd.append("file", request.file);
      console.log('fd', fd);
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
