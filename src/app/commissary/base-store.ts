import { Injectable } from '@angular/core';
import { Content } from '../interfaces/content';
import { Taxonomy } from '../interfaces/taxonomy';
import { BehaviorSubject, Observable } from 'rxjs';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { CollectionKey } from '../interfaces/firebase';

type Item = Content | Taxonomy;

// @Injectable({
//   providedIn: 'root'
// })
export class BaseStore {
  private observer: BehaviorSubject<Item[]>;
  private collection: AngularFirestoreCollection;

  constructor(
    private fireStore: AngularFirestore,
    private key: CollectionKey
  ) {

    this.observer = <BehaviorSubject<Item[]>>new BehaviorSubject([]);

    this.collection = this.fireStore.collection<Item>(this.key);

    this.collection.valueChanges().subscribe((items: Item[]) => {
      this.observer.next(items);
    });
  }

  /**
  * observable for watching data
  *
  * @returns {Observable<Item[]>}
  */
  public get data(): Observable<Item[]> {
    return this.observer.asObservable();
  }

  public async add(item: Item): Promise<void> {
    console.log('add item', item);
    const sanitizedItem = JSON.parse(JSON.stringify(item));
    this.collection.doc(item.id).set(sanitizedItem);
  }
}
