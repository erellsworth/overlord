import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogModule } from 'primeng/dialog';
import { ImageModule } from 'primeng/image';
import { Image } from '@overlord/types';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faFileImport,
  faPenToSquare,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import {
  ImageEditEvent,
  ImageEditorComponent,
} from '../image-editor/image-editor.component';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { Textarea } from 'primeng/inputtextarea';
import { FormsModule } from '@angular/forms';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-image-card',
  imports: [
    ButtonGroupModule,
    ButtonModule,
    CardModule,
    ConfirmPopupModule,
    DialogModule,
    DividerModule,
    FloatLabelModule,
    FontAwesomeModule,
    FormsModule,
    ImageEditorComponent,
    ImageModule,
    Textarea,
  ],
  providers: [ConfirmationService],
  templateUrl: './image-card.component.html',
  styleUrl: './image-card.component.scss',
})
export class ImageCardComponent {
  @Input() caption!: string;
  @Input({ required: true }) image!: Image;

  @Output() imageSelected = new EventEmitter<{
    image: Image;
    caption?: string;
  }>();
  @Output() imageEdited = new EventEmitter<ImageEditEvent>();
  @Output() deleteImage = new EventEmitter();

  public icons = {
    delete: faTrash,
    edit: faPenToSquare,
    insert: faFileImport,
  };

  public showEditor = false;

  constructor(private confirmationService: ConfirmationService) {}

  public delete(event: MouseEvent): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to delete this image?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteImage.emit();
      },
    });
  }

  public handleImageEdit(event: ImageEditEvent): void {
    this.imageEdited.emit(event);
    this.showEditor = false;
  }
}
