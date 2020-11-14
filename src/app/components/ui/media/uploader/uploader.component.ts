import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Observable } from 'rxjs';
import { MediaStore } from '../../../../commissary/media-store';
import { Media, MediaUploadRequest } from '../../../../interfaces/media';
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

  private s3Uploader: (params: MediaUploadRequest) => Observable<string>;

  constructor(
    cloudFunctions: AngularFireFunctions,
    private store: MediaStore,
  ) {
    this.s3Uploader = cloudFunctions.httpsCallable('uploader');
  }

  ngOnInit(): void {
    this.uploadFile();
  }

  /**
 * mediaSelected
 */
  public mediaSelected() {
    // this.preview.options.size = this.options.size;
    this.onSelect.emit(this.media);
  }

  private async uploadFile() {
    if (!this.file) { return; }
    this.isUploading = true;
    await this.prepareMediaRecord();

    const reader = new FileReader();

    reader.onload = async (e) => {

      this.media = {
        url: e.target.result as string,
        type: this.file.type, // mimetype
        name: this.file.name,
        options: {
          altText: this.file.name
        }
      }

      const mediaRecord = await this.store.search('name', '==', this.file.name);

      console.log('mediaRecord', mediaRecord);

      if (mediaRecord.length) {
        // propose new name
      }

      this.s3Uploader({
        bucket: environment.s3Bucket, // TODO: fetch this dynamically
        image: e.target.result as string,
        type: this.file.type,
        name: this.file.name
      }).subscribe((url: string) => {
        console.log('upload result', url);
        this.media.url = url;
        this.store.add(this.media);
        this.isUploaded = true;
        this.isUploading = false;
        this.onUploadComplete.emit(this.media);
      });
    };

    reader.readAsDataURL(this.file);
  }

  private async prepareMediaRecord() {
    if (!this.media.id) {
      this.media.id = this.store.fireStore.createId();
    }
    
    const mediaRecord = await this.store.search('name', '==', this.file.name);

    if (mediaRecord.length) { 

      this.file.name 
      
    }

    return;

  }

  private incrementFileName() {
    
  }
}
