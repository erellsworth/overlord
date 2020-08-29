import 'firebase';

export interface IUser extends firebase.User {
  isAdmin?: boolean;
}

export type User = IUser | null;
