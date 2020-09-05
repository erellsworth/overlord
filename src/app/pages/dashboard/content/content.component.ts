import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Content } from '../../../interfaces/content';
import { ContentStore } from '../../../commissary/content-store';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  public content: Content;
  public id: string = '';

  constructor(
    private route: ActivatedRoute,
    private store: ContentStore
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  async ngOnInit(): Promise<void> {
    this.store.get(this.id).subscribe((content: firebase.firestore.DocumentData) => {
      this.content = content.data();
    });
  }

  public async save(content: Content) {
    this.store.save(content);
  }
}
