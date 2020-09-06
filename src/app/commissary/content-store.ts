import { BaseStore } from './base-store';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ContentTypes, Content } from '../interfaces/content';

@Injectable({
  providedIn: 'root'
})
export class ContentStore extends BaseStore {
  constructor(fireStore: AngularFirestore) {
    super(fireStore, 'content');
  }

  public async findByType(type: ContentTypes): Promise<Content[]> {
    const contents = await this.search('type', '==', type);
    return contents as Content[];
  }
}
