import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { NgxTiptapModule } from 'ngx-tiptap';
import { PanelModule } from 'primeng/panel';
import { SharedModule } from '../../modules/shared/shared.module';
import { ToolbarComponent } from './toolbar/toolbar.component';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [FormsModule, NgxTiptapModule, PanelModule, ToolbarComponent],
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
