import { Environment } from '../app/interfaces/environment';
import { firebaseCredentials } from '../firebase.config';

export const environment: Environment = {
  production: true,
  firebaseCredentials: firebaseCredentials
};
