import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { CollectionKey } from '../interfaces/firebase';
import { Observable, BehaviorSubject } from 'rxjs';

interface CollectionItem {
  id: string;
};

@Injectable({
  providedIn: 'root'
})
export class MemoryHoleService {

  private collections: { [key in CollectionKey]: AngularFirestoreCollection };

  constructor(
    private fireStore: AngularFirestore
  ) { }


  public async save<T extends CollectionItem>(key: CollectionKey, item: T): Promise<void> {

    if (!this.collections[key]) {
      this.collections[key] = this.fireStore.collection<T>(key);
    }

    const sanitizedItem = JSON.parse(JSON.stringify(item));
    this.collections[key].doc(item.id).set(sanitizedItem);
  }

  public createId(): string {
    return this.fireStore.createId();
  }
}
