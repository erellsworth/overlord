import { BaseStore } from './base-store';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ContentStore extends BaseStore {
  constructor(fireStore: AngularFirestore) {
    super(fireStore, 'content');
  }
}
