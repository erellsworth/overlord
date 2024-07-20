import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { filter, map, Observable, of } from 'rxjs';
import { ApiResponse } from '../../../interfaces/misc';
import { TaxonomyInterface } from '../../../interfaces/taxonomy';

@Injectable({
  providedIn: 'root'
})
export class TaxonomyService {

  constructor(private http: HttpClient) { }

  public getTaxonomies$(): Observable<TaxonomyInterface[]> {
    try {
      return this.http.get<ApiResponse<TaxonomyInterface[]>>(`api/tags`).pipe(map(result => {
        if (result.success) {
          return result.data as TaxonomyInterface[];
        }
        console.error('Problem fetching taxonomies', result.error);
        return [];
      }));
    } catch (e) {
      console.error('Problem fetching taxonomies', e);
      return of([]);
    }
  }
}
