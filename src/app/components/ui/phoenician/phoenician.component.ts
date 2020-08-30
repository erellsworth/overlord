import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ContentChange } from 'ngx-quill';

import { PhoenicianData } from './phoenician.interface';

@Component({
  selector: 'phoenician',
  templateUrl: './phoenician.component.html',
  styleUrls: ['./phoenician.component.scss']
})
export class PhoenicianComponent implements OnInit {

  @Output() onUpdate: EventEmitter<PhoenicianData> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  public contentChanged(event: ContentChange) {
    this.onUpdate.emit({
      content: event.content,
      html: event.html,
      text: event.text
    });
  }
}
