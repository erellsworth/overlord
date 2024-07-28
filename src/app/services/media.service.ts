import { Injectable, signal } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MediaLibraryComponent, SelectedImageConfig } from '../dashboard/media-library/media-library.component';
import { HttpClient } from '@angular/common/http';
import { ApiResponse, PaginatedApiResponse } from '../../../interfaces/misc';
import { Image, MediaCreationResult } from '../../../interfaces/media';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  public hasInitiated = false;
  public imageCaptions: { [key: number]: string; } = {}; //TODO: This should probably be stored in the database
  public media = signal<{ [key: number]: Image[] }>({});
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

  public async upload(file: File): Promise<any> {
    try {
      // const newNameResult = await firstValueFrom(this.http.get<ApiResponse<{ validName: string }>>(
      //   `api/media/getValidFileName/${file.name}`
      // ));

      // // if (newNameResult.success) { 
      // //   file.name = newNameResult.data?.validName as string;
      // // }

      // return;

      const fd = new FormData();
      fd.append('crops', JSON.stringify({}));
      fd.append("file", file);
      const result = await firstValueFrom(this.http.post<ApiResponse<MediaCreationResult>>("api/media/create", fd));

      console.log('result', result);

      if (result.success) {
        const image = result.data?.image as Image;
        this.media()[0].unshift(image);

        return {
          success: true,
          image
        }
      } else {
        return {
          success: false,
          error: result.error
        }
      }
    } catch (e) {
      return {
        success: false,
        error: e as Error
      }
    }
  }

}
