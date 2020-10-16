import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MediaStore } from '../../../../commissary/media-store';
import { Media, MediaPreview } from '../../../../interfaces/media';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-media-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss']
})
export class MediaSelectorComponent implements OnInit {

  public media: Media[] = [];
  public previews: { [key: string]: MediaPreview } = {};
  public files: File[] = [];
  public fileTypes = 'image/jpg,image/png,image/jpeg,image/svg+xml';

  public selectedMedia: Media;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private store: MediaStore,
    public dialogRef: MatDialogRef<MediaSelectorComponent>
  ) {
    this.store.data.subscribe((media: Media[]) => {
      this.media = media;
    });
  }

  ngOnInit(): void {

  }

  public getPreviews(): MediaPreview[] {
    return Object.keys(this.previews).map((key: string): MediaPreview => {
      return this.previews[key];
    });
  }

  public onDrop(event: NgxDropzoneChangeEvent) {
    this.files = this.files.concat(event.addedFiles);
    this.changeDetector.detectChanges();
  }

  /**
 * mediaSelected
 */
  public mediaSelected(preview: MediaPreview) {

    this.dialogRef.close(preview);
  }

  public uploadComplete(preview: MediaPreview) {
    console.log('uploadComplete', preview);
    this.changeDetector.detectChanges();
  }

  public uploadProgress(progress: number) {
    console.log('uploadProgress', progress);
    this.changeDetector.detectChanges();
  }
}
