import { Component, Input } from '@angular/core';
import { Button, ButtonModule } from 'primeng/button';
import { Editor } from '@tiptap/core';
import { Level } from '@tiptap/extension-heading';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Icons } from './toolbar.icons';
import { MediaService } from '../../../services/media.service';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialog,
} from 'primeng/dynamicdialog';
import { VideoInputComponent } from '../video-input/video-input.component';
import { Subscription } from 'rxjs';
import { LinkInputComponent } from '../link-input/link-input.component';
import { LinkConfig } from '../link-input/link-input.interface';

@Component({
  selector: 'app-toolbar',
  imports: [ButtonModule, DynamicDialog, FontAwesomeModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
  providers: [DialogService],
})
export class ToolbarComponent {
  @Input({ required: true }) editor!: Editor;

  public headingLevels = [...Array(6).keys()].map(
    (level) => (level + 1) as Level,
  );
  public icons = Icons;

  private subs: Subscription[] = [];

  constructor(
    private dialogService: DialogService,
    private media: MediaService,
  ) {}

  public get focus() {
    return this.editor.chain().focus();
  }

  public buttonSeverity(style: string, attributes?: {}): Button['severity'] {
    return this.editor.isActive(style, attributes) ? 'info' : undefined;
  }

  public logOutput(): void {
    console.log(this.editor.getJSON());
  }

  public showImageLibrary(): void {
    this.media.launchLibrary(this.dialogService, {
      source: 'editor',
    });
  }

  public showLinkInput(): void {
    const linkAttr: DynamicDialogConfig = {
      header: 'Link Editor',
      closable: true,
    };

    if (this.editor.isActive('link')) {
      linkAttr.data = this.editor.getAttributes('link');
    }

    const ref = this.dialogService.open(LinkInputComponent, linkAttr);
    this.subs.push(
      ref.onClose.subscribe((link: LinkConfig) => {
        if (link) {
          this.focus.extendMarkRange('link').setLink(link).run();
        } else {
          this.focus.extendMarkRange('link').unsetLink().run();
        }
      }),
    );
  }

  public showVideoInput(): void {
    const ref = this.dialogService.open(VideoInputComponent, {
      header: 'Video URL',
      closable: true,
    });
    this.subs.push(
      ref.onClose.subscribe((src) => {
        this.editor.commands.setExternalVideo({ src });
      }),
    );
  }
}
