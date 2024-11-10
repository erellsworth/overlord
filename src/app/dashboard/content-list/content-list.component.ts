import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListboxModule } from 'primeng/listbox';
import { ContentService } from '../../services/content.service';
import { ContentInterface } from '../../../../interfaces/content';
import { Observable, map, of } from 'rxjs';
import { PaginatedApiResponse } from '../../../../interfaces/misc';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-content-list',
  standalone: true,
  imports: [CommonModule, ListboxModule, RouterModule],
  templateUrl: './content-list.component.html',
  styleUrl: './content-list.component.scss',
})
export class ContentListComponent {
  public content$: Observable<ContentInterface[]> = of([]);

  constructor(private contentService: ContentService) {}

  @Input()
  set contentType(contentType: string) {
    this.content$ = this.contentService.getContentByType$(contentType).pipe(
      map((response: PaginatedApiResponse<ContentInterface>) => {
        if (response.success && response.data) {
          return response.data.contents;
        }
        return [];
      })
    );
  }
}
