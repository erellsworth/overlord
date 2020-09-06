import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ContentChange } from 'ngx-quill';

import { PhoenicianData } from './phoenician.interface';

@Component({
  selector: 'phoenician',
  templateUrl: './phoenician.component.html',
  styleUrls: ['./phoenician.component.scss']
})
export class PhoenicianComponent implements OnInit {

  @Input() contentData: PhoenicianData;

  @Output() onUpdate: EventEmitter<PhoenicianData> = new EventEmitter();

  public contentJson: string = '';

  constructor() { }

  ngOnInit(): void {
    if (this.contentData) {
      this.contentJson = JSON.stringify(this.contentData.content);
    }
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
