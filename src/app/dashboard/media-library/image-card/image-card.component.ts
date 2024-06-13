import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Dialog, DialogModule } from 'primeng/dialog';
import { ImageModule } from 'primeng/image';
import { Image } from '../../../../../interfaces/media';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFileImport, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ImageEditorComponent } from '../image-editor/image-editor.component';
import { DynamicDialogComponent } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-image-card',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    DialogModule,
    FontAwesomeModule,
    ImageEditorComponent,
    ImageModule],
  templateUrl: './image-card.component.html',
  styleUrl: './image-card.component.scss'
})
export class ImageCardComponent {

  @Input({ required: true }) image!: Image;

  @Output() imageSelected = new EventEmitter<Image>();

  public icons = {
    delete: faTrash,
    edit: faPenToSquare,
    insert: faFileImport
  };

  public showEditor = false;

}
