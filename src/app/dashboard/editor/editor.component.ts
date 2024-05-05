import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { NgxTiptapModule } from 'ngx-tiptap';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [FormsModule, NgxTiptapModule],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss'
})
export class EditorComponent implements OnDestroy {

  public content = '';

  public editor = new Editor({
    extensions: [StarterKit]
  })

  ngOnDestroy(): void {
    this.editor.destroy();
  }
}
