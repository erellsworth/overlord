import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MediaService } from '../../../services/media.service';
import { DialogService } from 'primeng/dynamicdialog';
import { ImageModule } from 'primeng/image';
import { Image } from '../../../../../interfaces/media';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-image-selector',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    ImageModule,
    ReactiveFormsModule
  ],
  providers: [DialogService],
  templateUrl: './image-selector.component.html',
  styleUrl: './image-selector.component.scss'
})
export class ImageSelectorComponent implements OnInit {
  @Input({ required: true }) formGroup!: FormGroup;

  public image!: Image | null;

  private subs: Subscription[] = [];

  constructor(private dialogService: DialogService, private media: MediaService) { }

  ngOnInit(): void {
    if (this.mediaIdControl?.value) {
      this.subs.push(this.media.getImageById$(this.mediaIdControl.value).subscribe(response => {
        if (response.success) {
          this.image = response.data as Image;
        }
      }));
    }

    this.subs.push(this.media.selectedImage.subscribe(data => {
      if (data.image && data.source === 'selector') {
        this.image = data.image;
        this.mediaIdControl?.setValue(data.image.data.id);
      }
    }));
  }

  private get mediaIdControl() {
    return this.formGroup.get('metaData')?.get('media_id');
  }

  public removeImage(): void {
    this.mediaIdControl?.setValue(0);
    this.image = null;
  }

  public showImageLibrary(): void {
    this.media.launchLibrary(this.dialogService, {
      image: this.image as Image,
      source: 'selector'
    });
  }
}
