import { Component, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MediaService } from '@services/media.service';
import { DialogService } from 'primeng/dynamicdialog';
import { ImageModule } from 'primeng/image';
import { Image } from '@overlord/types';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FormService } from '../../../form.service';

@Component({
  selector: 'app-image-selector',
  imports: [ButtonModule, CommonModule, ImageModule, ReactiveFormsModule],
  providers: [DialogService],
  templateUrl: './image-selector.component.html',
  styleUrl: './image-selector.component.scss',
})
export class ImageSelectorComponent implements OnInit {
  public image = signal<Image | null>(null);

  private subs: Subscription[] = [];

  constructor(
    private dialogService: DialogService,
    private formService: FormService,
    private media: MediaService,
  ) {}

  ngOnInit(): void {
    if (this.metatDataControl?.value) {
      this.subs.push(
        this.media.getImageById$(this.mediaId).subscribe((response) => {
          if (response.success) {
            this.image.set(response.data as Image);
          }
        }),
      );
    }

    this.subs.push(
      this.media.selectedImage.subscribe((data) => {
        if (data.image && data.source === 'selector') {
          this.image.set(data.image);
          this.mediaId = data.image.data.id as number;
        }
      }),
    );
  }

  private get formGroup() {
    return this.formService.form();
  }

  private get metatDataControl() {
    return this.formGroup.get('metaData');
  }

  private get mediaId() {
    return this.metatDataControl?.value.media_id as number;
  }

  private set mediaId(id: number) {
    const metaData = this.metatDataControl?.value;
    if (metaData) {
      metaData.media_id = id;
      this.metatDataControl?.setValue(metaData);
    }
  }

  public removeImage(): void {
    this.mediaId = 0;
    this.image.set(null);
  }

  public showImageLibrary(): void {
    this.media.launchLibrary(this.dialogService, {
      image: this.image() as Image,
      source: 'selector',
    });
  }
}
