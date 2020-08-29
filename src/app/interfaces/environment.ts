import { FirebaseCredentials } from './firebase';

export interface Environment {
  production: boolean;
  firebaseCredentials: FirebaseCredentials;
}
