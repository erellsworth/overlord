import { Component, Injector, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { Content, Editor } from '@tiptap/core';
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

  constructor(private injector: Injector, private media: MediaService) { }

  ngOnInit(): void {
    this.subs.push(this.media.selectedImage.subscribe((data: { image: Image }) => {
      if (!data.image.data) { return; }

      const { image } = data;
      const { alt, caption, id } = image.data;

      if (!id) { return; }

      const src = image.full;

      this.editor.commands.setCustomImage({ src, alt, caption, id });

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
