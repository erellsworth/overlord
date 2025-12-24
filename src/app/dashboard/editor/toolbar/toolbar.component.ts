import { Component, Input } from '@angular/core';
import { Button, ButtonModule } from 'primeng/button';
import { Editor } from '@tiptap/core';
import { Level } from '@tiptap/extension-heading';
import { PopoverModule } from 'primeng/popover';
import { SliderModule } from 'primeng/slider';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Icons } from './toolbar.icons';
import { MediaService } from '../../../services/media.service';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogModule,
} from 'primeng/dynamicdialog';
import { VideoInputComponent } from '../video-input/video-input.component';
import { Subscription } from 'rxjs';
import { LinkInputComponent } from '../link-input/link-input.component';
import { LinkConfig } from '../link-input/link-input.interface';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { QuoteInputComponent } from '../quote-input/quote-input.component';
import { QuoteConfig } from '../quote-input/quote-input.interface';

@Component({
  selector: 'app-toolbar',
  imports: [
    ButtonModule,
    DynamicDialogModule,
    FontAwesomeModule,
    FormsModule,
    InputTextModule,
    PopoverModule,
    SliderModule,
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
  providers: [DialogService],
})
export class ToolbarComponent {
  @Input({ required: true }) editor!: Editor;

  public columnNumber = 2;

  public headingLevels = [...Array(6).keys()].map(
    (level) => (level + 1) as Level,
  );
  public icons = Icons;

  private sub = new Subscription();

  constructor(
    private dialogService: DialogService,
    private media: MediaService,
  ) {}

  public get focus() {
    return this.editor.chain().focus();
  }

  private get selectedText() {
    const { view, state } = this.editor;
    const { from, to } = view.state.selection;
    return state.doc.textBetween(from, to, '');
  }

  public addColumnSection(): void {
    this.editor.commands.setColumns(this.columnNumber);
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
    this.sub.add(
      ref?.onClose.subscribe((link: LinkConfig) => {
        if (link) {
          this.focus.extendMarkRange('link').setLink(link).run();
        } else {
          this.focus.extendMarkRange('link').unsetLink().run();
        }
      }),
    );
  }

  public showQuoteInput(): void {
    const quoteAttr: DynamicDialogConfig = {
      header: 'Quote Editor',
      closable: true,
      data: {
        text: this.editor.view.state.selection.content().content.toJSON(),
      },
    };

    if (this.editor.isActive('quote')) {
      quoteAttr.data = this.editor.getAttributes('quote');
    }

    const ref = this.dialogService.open(QuoteInputComponent, quoteAttr);
    this.sub.add(
      ref?.onClose.subscribe((quote: QuoteConfig) => {
        console.log('quote', quote);
        if (quote) {
          this.editor.commands.setQuote(quote);
        } else {
          this.editor.commands.unsetQuote();
        }
      }),
    );
  }

  public showVideoInput(): void {
    const ref = this.dialogService.open(VideoInputComponent, {
      header: 'Video URL',
      closable: true,
    });
    this.sub.add(
      ref?.onClose.subscribe((src) => {
        this.editor.commands.setExternalVideo({ src });
      }),
    );
  }
}
