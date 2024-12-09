import { Component, Injector, OnDestroy, OnInit, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Content, Editor, generateJSON, JSONContent } from '@tiptap/core';
import { NgxTiptapModule } from 'ngx-tiptap';
import { PanelModule } from 'primeng/panel';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { MediaService } from '../../services/media.service';
import { Subscription } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import Extensions from './nodes/extensions';
import { CardModule } from 'primeng/card';
import { SelectedImageConfig } from '../media-library/media-library.component';
import { FormService } from '../form.service';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    FormsModule,
    NgxTiptapModule,
    PanelModule,
    ToolbarComponent,
  ],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss',
})
export class EditorComponent implements OnInit, OnDestroy {
  public content!: Content;
  public contentChanged = output();

  public editor!: Editor;

  private subs: Subscription[] = [];

  constructor(
    private formService: FormService,
    private injector: Injector,
    private media: MediaService,
  ) {}

  public get formGroup() {
    return this.formService.form();
  }

  ngOnInit(): void {
    this.content =
      this.formGroup.get('content')?.value ||
      this.formGroup.get('html')?.value ||
      '';

    this.editor = new Editor({
      extensions: Extensions(this.injector),
      content: this.content,
    });

    if (typeof this.content === 'string') {
      this.editor.commands.setContent(
        generateJSON(this.content, Extensions(this.injector)),
      );
      this.handleContentChange();
    }
    if (typeof this.content === 'object') {
      // pre-populate captions in media library based on content;
      const images = (this.content as JSONContent).content?.filter(
        (content) => content.type === 'imageFigure',
      );
      images?.forEach((image) => {
        if (image.attrs && image.attrs.caption) {
          this.media.imageCaptions[image.attrs.imageId] = image.attrs.caption;
        }
      });
    }

    this.subs.push(
      this.media.selectedImage.subscribe((data: SelectedImageConfig) => {
        if (!data.image?.data || data.source !== 'editor') {
          return;
        }

        const { caption, image } = data;
        const { alt, id } = image.data;

        if (!id) {
          return;
        }

        const src = image.full;

        this.editor.commands.setCustomImage({ src, alt, caption, imageId: id });

        if (caption) {
          this.media.imageCaptions[id] = caption;
        }
      }),
    );
  }

  ngOnDestroy(): void {
    this.editor.destroy();
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  public get counts(): { [key: string]: number } {
    const node = this.editor.state.doc;
    const text = node.textBetween(0, node.content.size, ' ', ' ');
    const words = text.split(' ').filter((word) => word !== '').length;
    const characters = text.length;
    return {
      words,
      characters,
    };
  }

  public handleContentChange(): void {
    const meta = this.formGroup.get('metaData');
    meta?.setValue({
      ...meta.value,
      wordCount: this.counts.words,
    });
    this.formGroup.get('content')?.setValue(this.editor.getJSON());
    this.formGroup.get('html')?.setValue(this.editor.getHTML());
    this.formGroup.get('text')?.setValue(this.editor.getText());
    // this.contentChanged.emit();
  }
}
