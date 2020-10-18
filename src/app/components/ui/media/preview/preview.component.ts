import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Media } from '../../../../interfaces/media';

@Component({
  selector: 'app-image-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class ImagePreviewComponent implements OnInit {

  @Input() media: Media;

  @Output() onSelect: EventEmitter<Media> = new EventEmitter();

  public showOptions: boolean = false;
  public options = {
    size: 'small'
  }

  constructor() { }

  ngOnInit(): void { }

  /**
   * mediaSelected
   */
  public mediaSelected() {
    this.onSelect.emit(this.media);
  }

  /**
   * toggleOptions
   */
  public toggleOptions() {
    this.showOptions = !this.showOptions;
  }
}
