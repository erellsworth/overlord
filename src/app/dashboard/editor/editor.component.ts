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
import { MediaService } from '../../services/media.service';
import { Subscription } from 'rxjs';
import { Image } from '../../../../interfaces/media';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [FormsModule, NgxTiptapModule, PanelModule, ToolbarComponent],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss'
})
export class EditorComponent implements OnInit, OnDestroy {

  @Input({ required: true }) content!: Content;

  public editor = new Editor({
    extensions: [CustomImage, StarterKit, Video, FigCaption, FigureNode],
    content: this.content,
  });

  private subs: Subscription[] = [];

  constructor(private media: MediaService) { }

  ngOnInit(): void {
    this.subs.push(this.media.selectedImage.subscribe((image: Image) => {
      if (!image.data) { return; }
      const src = image.full;
      const caption = 'test caption';
      const alt = 'test alt';
      const { id } = image.data;
      if (id) {
        this.editor.commands.setCustomImage({ src, alt, caption, id });
      }
    }))
  }

  ngOnDestroy(): void {
    this.editor.destroy();
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
