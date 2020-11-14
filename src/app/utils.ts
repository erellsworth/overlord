import { Injectable } from '@angular/core';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class Utils {

  /**
  * transforms a variable into a boolean
  * for arrays it will return true if the length of the array is more than 0
  *
  * @param {any} obj
  *
  * @returns {boolean}
  */
  public getBoolean(obj: any): boolean {
    if (!obj) { return false; }

    if (typeof obj === 'boolean') { return obj; }

    if (typeof obj.filter === 'function') {
      obj = obj.filter((item: any) => {
        return item;
      });
    }

    if (typeof obj === 'string') {
      return (obj !== 'false');
    }

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0) { return true; }
    if (obj.length === 0) { return false; }

    return obj;
  }

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

  /**
   * Add a number to the end of a string,
   * or increment the number at the end of a string
   *
   * @param { string } name
   *
   * @returns { string }
   */
  public incrementString(name: string): string {
    if (!name) { return ''; }

    const numbers: string[] = name.split(/\D+/g).filter(Boolean);

    if (!numbers.length) {
      // there are no numbers in this name,
      // so just add a number to the end and return
      return name + '2';
    }

    const endNumbers: string = numbers.pop();
    const newEndNumbers: number = parseInt(endNumbers) + 1;

    const characters: string[] = name.split(endNumbers)
      .filter(Boolean)
      .map((chars: string): string => {
        if (chars === endNumbers) {
          return newEndNumbers.toString()
        }
        return chars;
      });

    return characters.join('');
  }
}
