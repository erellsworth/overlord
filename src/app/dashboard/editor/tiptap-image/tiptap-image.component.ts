import { Component } from '@angular/core';
import { AngularNodeViewComponent } from 'ngx-tiptap';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-tiptap-image',
  standalone: true,
  imports: [ButtonModule, ButtonGroupModule, FontAwesomeModule, ImageModule],
  templateUrl: './tiptap-image.component.html',
  styleUrl: './tiptap-image.component.scss'
})
export class TiptapImageComponent extends AngularNodeViewComponent {

  public editIcon = faEdit;
  public showButtons = false;
}
