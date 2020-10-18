import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Observable } from 'rxjs';
import { MediaStore } from '../../../../commissary/media-store';
import { Media } from '../../../../interfaces/media';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-media-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss']
})
export class UploaderComponent implements OnInit {

  @Input() file: File;
  @Output() onUploadComplete: EventEmitter<Media> = new EventEmitter();

  @Output() onSelect: EventEmitter<Media> = new EventEmitter();

  public media: Media;

  public isUploading: boolean = false;
  public isUploaded: boolean = false;

  private s3Uploader: (params: any) => Observable<any>;

  constructor(
    cloudFunctions: AngularFireFunctions,
    private store: MediaStore,
  ) {
    this.s3Uploader = cloudFunctions.httpsCallable('uploader');
  }

  ngOnInit(): void {

    if (this.file) {
      this.isUploading = true;

      const reader = new FileReader();

      reader.onload = (e) => {

        this.media = {
          url: e.target.result as string,
          type: this.file.type, // mimetype
          name: this.file.name,
          options: {
            altText: this.file.name
          }
        }

        this.s3Uploader({
          bucket: environment.s3Bucket, // TODO: fetch this dynamically
          image: e.target.result,
          type: this.file.type,
          name: this.file.name
        }).subscribe((result) => {
          console.log('upload result', result);
          this.isUploaded = true;
          this.isUploading = false;
          this.onUploadComplete.emit(this.media);
        });

        // this forces the component to re-render
        // without this, the image previews will not load until the user
        // clicks on the div
        // this.changeDetector.detectChanges();
      };

      reader.readAsDataURL(this.file);
    }
  }

  /**
 * mediaSelected
 */
  public mediaSelected() {
    // this.preview.options.size = this.options.size;
    this.onSelect.emit(this.media);
  }
}
