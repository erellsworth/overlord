import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { MediaStore } from '../../../../commissary/media-store';
import { MediaPreview } from '../../../../interfaces/media';

@Component({
  selector: 'app-media-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss']
})
export class UploaderComponent implements OnInit {

  @Input() file: File;
  @Output() onUploadComplete: EventEmitter<MediaPreview> = new EventEmitter();
  @Output() onUploadProgress: EventEmitter<number> = new EventEmitter();

  public isUploading: boolean = false;
  public isUploaded: boolean = false;

  public preview: MediaPreview;

  constructor(
    private store: MediaStore,
    private storage: AngularFireStorage
  ) { }

  ngOnInit(): void {
    console.log('uploaded ngOnInit', this.file);
    if (this.file) {
      this.isUploading = true;

      const reader = new FileReader();

      this.onUploadProgress.emit(0);

      reader.onload = (e) => {

        this.onUploadProgress.emit(0);

        this.preview = {
          file: this.file,
          url: e.target.result as string,
          uploadPercentage: 0,
          uploadSettings: {
            altText: this.file.name
          }
        };


        const filePath = 'overlord/' + this.file.name;
        const fileRef = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, this.file);

        // observe percentage changes
        task.percentageChanges().subscribe((percent: number) => {
          console.log('percentageChanges', percent);
          this.preview.uploadPercentage = percent;
        });
        // get notified when the download URL is available
        task.snapshotChanges().pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe((url: string) => {
              console.log('url', url);
              this.isUploading = false;
              // this.previews[file.name] = url;
              this.preview.url = url;
              this.onUploadComplete.emit(this.preview);
            });
          })
        ).subscribe();
      };

      reader.readAsDataURL(this.file);
    }
  }

}
