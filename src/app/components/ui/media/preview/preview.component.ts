import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MediaPreview } from '../../../../interfaces/media';

@Component({
  selector: 'app-image-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class ImagePreviewComponent implements OnInit {

  @Input() preview: MediaPreview;

  @Output() onSelect: EventEmitter<MediaPreview> = new EventEmitter();

  public showOptions: boolean = false;
  public options = {
    size: 'small'
  }

  constructor() { }

  ngOnInit(): void { }

  /**
   * imageSelected
   */
  public imageSelected() {
    // this.preview.options.size = this.options.size;
    this.onSelect.emit(this.preview);
  }

  /**
   * toggleOptions
   */
  public toggleOptions() {
    this.showOptions = !this.showOptions;
  }
}
