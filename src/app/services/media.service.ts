import { Injectable, signal } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MediaLibraryComponent } from '../dashboard/media-library/media-library.component';
import { HttpClient } from '@angular/common/http';
import { ApiResponse, PaginatedApiResponse } from '../../../interfaces/misc';
import { Image } from '../../../interfaces/media';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  public hasInitiated = false;
  public media = signal<Image[]>([]);
  public selectedImage = new BehaviorSubject<{ image: Image; position?: number }>({ image: {} as Image });

  private ref!: DynamicDialogRef;

  private currentPage = 1;

  constructor(private http: HttpClient) { }


  public closeLibrary(): void {
    if (this.ref) { this.ref.close(); }
  }

  public getImageById$(id: number): Observable<ApiResponse<Image>> {
    return this.http.get<ApiResponse<Image>>(`api/media/image/${id}`);
  }

  public launchLibrary(service: DialogService, data?: { selectedImage: Image, position: number }): void {
    console.log('data', data);
    this.ref = service.open(MediaLibraryComponent, { header: 'Select an Image', data });
  }

  public async loadMedia(): Promise<void> {
    const result = await firstValueFrom(this.http.get<PaginatedApiResponse<Image>>(`api/media/${this.currentPage}`))
    this.currentPage++;
    if (result.success) {
      this.media.update((media) => media.concat(result.data?.contents || []));
      this.hasInitiated = true;
    }
  }

}
