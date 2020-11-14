import { BaseStore } from './base-store';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../services/user.service';
import { Utils } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class MediaStore extends BaseStore {
  constructor(
    public fireStore: AngularFirestore) {
    super(fireStore, 'media');
  }
}
