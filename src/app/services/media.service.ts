import { Injectable, signal } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MediaLibraryComponent } from '../dashboard/media-library/media-library.component';
import { HttpClient } from '@angular/common/http';
import { PaginatedApiResponse } from '../../../interfaces/misc';
import { Image } from '../../../interfaces/media';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  public hasInitiated = false;
  public media = signal<Image[]>([]);
  public selectedImage = new BehaviorSubject({} as Image);

  private ref!: DynamicDialogRef;

  private currentPage = 1;

  constructor(private http: HttpClient) { }

  public launchLibrary(service: DialogService): void {
    this.ref = service.open(MediaLibraryComponent, { header: 'Select a Product' });
  }

  public closeLibrary(): void {
    if (this.ref) { this.ref.close(); }
  }

  public async loadMedia() {
    const result = await firstValueFrom(this.http.get<PaginatedApiResponse<Image>>(`api/media/${this.currentPage}`))
    this.currentPage++;
    if (result.success) {
      this.media.update((media) => media.concat(result.data?.contents || []));
      this.hasInitiated = true;
    }
  }
}
