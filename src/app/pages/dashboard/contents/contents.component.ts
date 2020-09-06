import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { ContentTypes, Content } from '../../../interfaces/content';
import { ContentStore } from '../../../commissary/content-store';

@Component({
  selector: 'app-contents',
  templateUrl: './contents.component.html',
  styleUrls: ['./contents.component.scss']
})
export class ContentsComponent implements OnInit {

  public contentType: ContentTypes;
  public contents: Content[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: ContentStore
  ) {

    this.router.events.subscribe(async (event) => {
      if (event instanceof NavigationEnd) {
        this.contentType = this.route.snapshot.paramMap.get('type') as ContentTypes;
        this.contents = await this.store.findByType(this.contentType);
      }
    });

  }

  ngOnInit(): void { }

}
