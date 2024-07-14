import { Component, Injector, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { Content, Editor, JSONContent } from '@tiptap/core';
import { NgxTiptapModule } from 'ngx-tiptap';
import { PanelModule } from 'primeng/panel';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { MediaService } from '../../services/media.service';
import { Subscription } from 'rxjs';
import { Image } from '../../../../interfaces/media';
import { ButtonModule } from 'primeng/button';
import Extensions from './nodes/extensions';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [ButtonModule, FormsModule, NgxTiptapModule, PanelModule, ToolbarComponent],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss'
})
export class EditorComponent implements OnInit, OnDestroy {

  @Input({ required: true }) content!: Content;
  @Input({ required: true }) formGroup!: FormGroup;

  public editor = new Editor({
    extensions: Extensions(this.injector),
    content: this.content
  });

  private subs: Subscription[] = [];

  constructor(
    private injector: Injector,
    private media: MediaService) { }

  ngOnInit(): void {
    if (typeof this.content === 'object') {
      // pre-populate captions in media library based on content;
      const images = (this.content as JSONContent).content?.filter(content => content.type === 'imageFigure');
      images?.forEach(image => {
        if (image.attrs && image.attrs.caption) {
          this.media.imageCaptions[image.attrs.imageId] = image.attrs.caption;
        }
      });
    }

    this.subs.push(this.media.selectedImage.subscribe((data: {
      caption?: string;
      image: Image;
    }) => {
      if (!data.image.data) { return; }

      const { caption, image } = data;
      const { alt, id } = image.data;

      if (!id) { return; }

      const src = image.full;

      this.editor.commands.setCustomImage({ src, alt, caption, imageId: id });

      if (caption) {
        this.media.imageCaptions[id] = caption;
      }
    }));
  }

  ngOnDestroy(): void {
    this.editor.destroy();
    this.subs.forEach(sub => sub.unsubscribe());
  }

  public handleContentChange(): void {
    this.formGroup.controls['content'].setValue(this.editor.getJSON());
  }
}
