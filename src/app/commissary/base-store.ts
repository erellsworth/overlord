import { Injectable } from '@angular/core';
import { Content } from '../interfaces/content';
import { Taxonomy } from '../interfaces/taxonomy';
import { BehaviorSubject, Observable } from 'rxjs';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { CollectionKey } from '../interfaces/firebase';

type CollectionItem = Content & Taxonomy;

// @Injectable({
//   providedIn: 'root'
// })
export class BaseStore {
  private observer: BehaviorSubject<CollectionItem[]>;
  private collection: AngularFirestoreCollection;

  constructor(
    private fireStore: AngularFirestore,
    private key: CollectionKey
  ) {

    this.observer = <BehaviorSubject<CollectionItem[]>>new BehaviorSubject([]);

    this.collection = this.fireStore.collection<CollectionItem>(this.key);

    this.collection.valueChanges().subscribe((items: CollectionItem[]) => {
      this.observer.next(items);
    });
  }

  /**
  * observable for watching data
  *
  * @returns {Observable<CollectionItem[]>}
  */
  public get data(): Observable<CollectionItem[]> {
    return this.observer.asObservable();
  }

  public async add(item: CollectionItem): Promise<void> {
  }
}
