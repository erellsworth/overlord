import { Component, OnInit, ViewChild } from '@angular/core';
import { Content } from '../../interfaces/content';
import { ContentStore } from '../../commissary/content-store';
import { ContentEditorComponent } from '../../components/content-editor/content-editor.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild(ContentEditorComponent, { static: false }) editor: ContentEditorComponent;

  public contentList: Content[] = [];

  constructor(
    private store: ContentStore
  ) {
    this.store.data.subscribe((contents: Content[]) => {
      this.contentList = contents;
    });
  }

  ngOnInit(): void { }

  public save(content: Content) {
    this.store.add(content);
    this.editor.resetData();
  }
}
