import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { Media } from '../../../../interfaces/media';

@Component({
  selector: 'app-media-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss']
})
export class MediaSelectorComponent implements OnInit {

  public media: Media[] = [];
  public uploads: File[] = [];

  public fileTypes = 'image/jpg,image/png,image/jpeg,image/svg+xml';

  constructor(
    private changeDetector: ChangeDetectorRef,
    public dialogRef: MatDialogRef<MediaSelectorComponent>) {

    //TODO: fetch existing media from database

  }

  ngOnInit(): void { }

  public onDrop(event: NgxDropzoneChangeEvent) {
    this.uploads = this.uploads.concat(event.addedFiles);
    this.changeDetector.detectChanges();
  }

  /**
   * mediaSelected
   */
  public mediaSelected(media: Media) {
    this.dialogRef.close(media);
  }

}
