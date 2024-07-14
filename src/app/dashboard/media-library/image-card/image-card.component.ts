import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { ImageModule } from 'primeng/image';
import { Image } from '../../../../../interfaces/media';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFileImport, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ImageEditorComponent } from '../image-editor/image-editor.component';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormsModule } from '@angular/forms';
import { ButtonGroupModule } from 'primeng/buttongroup';

@Component({
  selector: 'app-image-card',
  standalone: true,
  imports: [
    ButtonGroupModule,
    ButtonModule,
    CardModule,
    DialogModule,
    DividerModule,
    FloatLabelModule,
    FontAwesomeModule,
    FormsModule,
    ImageEditorComponent,
    ImageModule,
    InputTextareaModule],
  templateUrl: './image-card.component.html',
  styleUrl: './image-card.component.scss'
})
export class ImageCardComponent {

  @Input() caption!: string;
  @Input({ required: true }) image!: Image;

  @Output() imageSelected = new EventEmitter<{
    image: Image;
    caption?: string;
  }>();
  @Output() imageEdited = new EventEmitter();

  public icons = {
    delete: faTrash,
    edit: faPenToSquare,
    insert: faFileImport
  };

  public showEditor = false;

  public handleImageEdit(event: {
    name: string;
    alt: string;
    caption?: string;
  }): void {
    this.imageEdited.emit(event);
    this.showEditor = false;
  }

}
