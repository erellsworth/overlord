import firebase from 'firebase/app';

export interface IUser extends firebase.User {
  isAdmin?: boolean;
}

export type User = IUser | null;
