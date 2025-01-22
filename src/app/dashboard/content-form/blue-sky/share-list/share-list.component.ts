import { Component, computed, input } from '@angular/core';
import { ContentInterface } from '@interfaces/content';
import { AtproResult } from '@interfaces/misc';

@Component({
  selector: 'app-share-list',
  imports: [],
  templateUrl: './share-list.component.html',
  styleUrl: './share-list.component.scss',
})
export class ShareListComponent {
  public shares = input.required<AtproResult[]>();

  public getUrl(share: AtproResult): string {
    const arr = share.uri.split('/');
    const postId = arr[arr.length - 1];
    return `https://bsky.app/profile/pickleglitch.com/post/${postId}`;
  }
}
