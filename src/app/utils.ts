import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Utils {
  /**
* capitalize every first letter of very word
*
* @param {string } str
*
* @returns {string}
*/
  public titleCase(str: string): string {
    if (!str) { return ''; }
    let splitStr = str.toLowerCase().split(' ');
    for (let i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
  }
}
