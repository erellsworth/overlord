import { Content } from '../interfaces/content';
import { Taxonomy } from '../interfaces/taxonomy';
import { Media } from '../interfaces/media';
import { BehaviorSubject, Observable } from 'rxjs';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { CollectionKey, WhereFilterOp } from '../interfaces/firebase';

type Item = Content | Taxonomy | Media;

export class BaseStore {
  private observer: BehaviorSubject<Item[]>;
  private collection: AngularFirestoreCollection;

  constructor(
    public fireStore: AngularFirestore,
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

  public add(item: Item): void {
    const sanitizedItem = JSON.parse(JSON.stringify(item));
    this.collection.doc(item.id).set(sanitizedItem);
  }

  public save(item: Item): void {
    const sanitizedItem = JSON.parse(JSON.stringify(item));
    this.collection.doc(item.id).update(sanitizedItem);
  }

  public get(id: string) {
    return this.collection.doc<Item>(id).get();
  }

  public async search(property: string, comparison: WhereFilterOp, value: any): Promise<Item[]> {
    const results = await this.collection.ref.where(property, comparison, value).get();

    return results.docs.map((result: firebase.firestore.DocumentData) => {
      return result.data();
    });
  }
}
