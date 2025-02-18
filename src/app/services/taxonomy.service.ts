import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiResponse, TaxonomyInterface } from '@overlord/types';

@Injectable({
  providedIn: 'root',
})
export class TaxonomyService {
  public taxonomies = signal<TaxonomyInterface[]>([]);

  constructor(private http: HttpClient) {
    this.fetchTaxonomies();
  }

  public async fetchTaxonomies(): Promise<void> {
    try {
      const result = await firstValueFrom(
        this.http.get<ApiResponse<TaxonomyInterface[]>>(`api/tags`),
      );

      if (result.success) {
        this.taxonomies.set(result.data as TaxonomyInterface[]);
      } else {
        console.error('Problem fetching taxonomies', result.error);
      }
    } catch (e) {
      console.error('Problem fetching taxonomies', e);
    }
  }
}
