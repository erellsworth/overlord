import { Component, Input } from '@angular/core';
import { Button, ButtonModule } from 'primeng/button';
import { Editor } from '@tiptap/core';
import { Level } from '@tiptap/extension-heading';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Icons } from './toolbar.icons';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [ButtonModule, FontAwesomeModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {
  @Input({ required: true }) editor!: Editor;

  public headingLevels = [...Array(6).keys()].map((level) => level + 1 as Level);
  public icons = Icons;

  public get focus() {
    return this.editor.chain().focus();
  }

  public buttonSeverity(style: string, attributes?: {}): Button['severity'] {
    return this.editor.isActive(style, attributes) ? 'success' : undefined;
  }

  public logOutput(): void {
    console.log(this.editor.getJSON());
  }

  public showImageLibrary(): void { }

}
