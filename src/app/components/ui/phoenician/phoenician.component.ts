import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { ContentChange, QuillEditorComponent, QuillModules } from 'ngx-quill';
import { MatDialog } from '@angular/material/dialog';

import { PhoenicianData } from './phoenician.interface';
import { MediaSelectorComponent } from '../media-selector/media-selector.component';

@Component({
  selector: 'phoenician',
  templateUrl: './phoenician.component.html',
  styleUrls: ['./phoenician.component.scss']
})
export class PhoenicianComponent implements OnInit {

  @Input() contentData: PhoenicianData;

  @Output() onUpdate: EventEmitter<PhoenicianData> = new EventEmitter();

  @ViewChild(QuillEditorComponent, { static: true }) quill: QuillEditorComponent;

  public contentJson: string = '';

  public modules: QuillModules = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: () => {
          this.showUploader(this.quill.quillEditor);
        }
      }
    }
  };

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    if (this.contentData) {
      this.contentJson = JSON.stringify(this.contentData.content);
    }
  }

  private showUploader(quill) {
    const selection = quill.getSelection();
    console.log(selection);

    const dialogRef = this.dialog.open(MediaSelectorComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
    // show media library
    // get url of selected or uploaded image
    // insert img tag

    quill.insertText(selection.index + selection.length, 'asd');
    // quill.insertEmbed(10, 'image', 'https://quilljs.com/images/cloud.png');

  }

  public reset() {
    this.contentJson = '';
  }

  public contentChanged(event: ContentChange) {

    this.onUpdate.emit({
      content: event.content,
      html: event.html,
      text: event.text
    });
  }
}
