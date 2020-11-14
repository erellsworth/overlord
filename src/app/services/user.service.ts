import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';

import { User } from '../interfaces/user';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _user: User = null;
  private observer: BehaviorSubject<User>;

  constructor(private auth: AngularFireAuth) {
    this.observer = new BehaviorSubject(this._user);



    this.auth.onAuthStateChanged(async (user: User) => {
      this._user = user;
      if (this._user) {
        const token = await this._user.getIdTokenResult();
        this._user.isAdmin = token.claims.admin;
      }
      this.observer.next(this._user);
    });
  }

  /**
  *
  * observable for watching user data
  *
  * @returns { Observable } User
  *
  */
  public get user(): Observable<User> {
    return this.observer.asObservable();
  }

  public isAnOverlord(): boolean {
    return this._user !== null && this._user.isAdmin === true;
  }

  public async login() {
    await this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  public async logout() {
    await this.auth.signOut();
  }

  public async getId(): Promise<string> {
    if (this._user) {
      return this._user.uid;
    }

    this._user = await new Promise((resolve) => {
      this.auth.user.subscribe((firebaseUser: User) => {
        resolve(firebaseUser);
      });
    });

    return this._user.uid;
  }
}
