import { Component, input } from '@angular/core';
import { AtproResult } from '@overlord/types';
import { ConfigService } from '@services/config.service';

@Component({
  selector: 'app-share-list',
  imports: [],
  templateUrl: './share-list.component.html',
  styleUrl: './share-list.component.scss',
})
export class ShareListComponent {
  public shares = input.required<AtproResult[]>();

  constructor(private config: ConfigService) {
    //
  }

  public getUrl(share: AtproResult): string {
    const arr = share.uri.split('/');
    const postId = arr[arr.length - 1];
    return `${this.config.config().atPro.profile}post/${postId}`;
  }
}
