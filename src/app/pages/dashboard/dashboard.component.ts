import { Component, OnInit, ViewChild } from '@angular/core';
import { Content } from '../../interfaces/content';
import { ContentStore } from '../../commissary/content-store';
import { ContentEditorComponent } from '../../components/content-editor/content-editor.component';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild(ContentEditorComponent, { static: false }) editor: ContentEditorComponent;

  public contentList: Content[] = [];

  constructor(
    private store: ContentStore,
    private storage: AngularFireStorage
  ) {
    this.store.data.subscribe((contents: Content[]) => {
      this.contentList = contents;
    });

    const ref = this.storage.ref('overlord/0_b3S7Pk3tgPj8s_wV.jpg');

    ref.getDownloadURL().subscribe((url: string) => {
      console.log('url', url);
    });

  }

  ngOnInit(): void { }

  public save(content: Content) {
    this.store.add(content);
    this.editor.resetData();
  }
}
