import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Content, Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { NgxTiptapModule } from 'ngx-tiptap';
import { PanelModule } from 'primeng/panel';
import { ToolbarComponent } from './toolbar/toolbar.component';
import CustomImage from './nodes/CustomImage';
import Video from './nodes/VideoNode';
import FigCaption from './nodes/FigCaption';
import FigureNode from './nodes/FigureNode';



@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [FormsModule, NgxTiptapModule, PanelModule, ToolbarComponent],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss'
})
export class EditorComponent implements OnDestroy {

  @Input({ required: true }) content!: Content;

  public editor = new Editor({
    extensions: [CustomImage, StarterKit, Video, FigCaption, FigureNode],
    content: this.content
  });

  constructor() { }

  ngOnDestroy(): void {
    this.editor.destroy();
  }
}
