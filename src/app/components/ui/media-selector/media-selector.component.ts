import { Component, OnInit } from '@angular/core';
import { MediaStore } from '../../../commissary/media-store';
import { Media } from '../../../interfaces/media';

@Component({
  selector: 'app-media-selector',
  templateUrl: './media-selector.component.html',
  styleUrls: ['./media-selector.component.scss']
})
export class MediaSelectorComponent implements OnInit {

  public media: Media[] = [];

  public selectedMedia: Media;

  constructor(private store: MediaStore) {
    this.store.data.subscribe((media: Media[]) => {
      this.media = media;
    });
  }

  ngOnInit(): void {

  }

}
