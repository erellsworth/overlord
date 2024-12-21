import { Component, OnDestroy, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AngularNodeViewComponent } from 'ngx-tiptap';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { DialogModule } from 'primeng/dialog';
import { ImageEditorComponent } from '../../media-library/image-editor/image-editor.component';
import { ImageModule } from 'primeng/image';
import { DialogService } from 'primeng/dynamicdialog';
import { faEdit, faRightLeft } from '@fortawesome/free-solid-svg-icons';
import { Image } from '../../../../../interfaces/media';
import { MediaService } from '../../../services/media.service';
import { Subscription } from 'rxjs';
import { SelectedImageConfig } from '../../media-library/media-library.component';

@Component({
  selector: 'app-tiptap-image',
  imports: [
    ButtonModule,
    ButtonGroupModule,
    DialogModule,
    FontAwesomeModule,
    ImageEditorComponent,
    ImageModule,
  ],
  templateUrl: './tiptap-image.component.html',
  styleUrl: './tiptap-image.component.scss',
  providers: [DialogService],
})
export class TiptapImageComponent
  extends AngularNodeViewComponent
  implements OnInit, OnDestroy
{
  public caption!: string;
  public icons = {
    edit: faEdit,
    replace: faRightLeft,
  };
  public image!: Image;
  public showButtons = false;
  public showEditor = false;

  private subs: Subscription[] = [];

  constructor(
    private dialogService: DialogService,
    private media: MediaService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.subs.push(
      this.media
        .getImageById$(this.node().attrs.imageId)
        .subscribe((result) => {
          if (result.success) {
            this.image = result.data as Image;
            this.caption = this.node().attrs.caption;
          }
        }),
    );

    this.subs.push(
      this.media.selectedImage.subscribe((data: SelectedImageConfig) => {
        const { image, position, source } = data;
        if (image && source === 'imageCard' && position === this.getPos()()) {
          this.image = image;
        }
      }),
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  public launchEditor(): void {
    this.showEditor = true;
  }

  public launchMediaLibrary(): void {
    this.media.launchLibrary(this.dialogService, {
      image: this.image,
      position: this.getPos()(),
      source: 'imageCard',
    });
  }
}
