// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Environment } from '../app/interfaces/environment';

export const environment: Environment = {
  production: false,
  firebaseCredentials: {
    apiKey: "AIzaSyDS1JkRgXw-ULvr4SoZrKJAxzaQUOsRTgE",
    authDomain: "er-ellsworth.firebaseapp.com",
    databaseURL: "https://er-ellsworth.firebaseio.com",
    projectId: "er-ellsworth",
    storageBucket: "er-ellsworth.appspot.com",
    messagingSenderId: "1030516368098",
    appId: "1:1030516368098:web:6f251ef6e9dc536189b4bb",
    measurementId: "G-WL5QNG0D8B"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
