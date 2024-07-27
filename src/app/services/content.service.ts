import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ContentInterface, ContentType } from '../../../interfaces/content';
import { Observable, of } from 'rxjs';
import { ApiResponse, PaginatedApiResponse } from '../../../interfaces/misc';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  constructor(private http: HttpClient) { }

  public getContentByType$(type: string = 'post'): Observable<PaginatedApiResponse<ContentInterface>> {
    try {
      return this.http.get<PaginatedApiResponse<ContentInterface>>(`api/contents/${type}`);
    } catch (e) {
      return of({
        success: false,
        error: e as Error
      });
    }
  }

  public getContentBySlug$(slug: string): Observable<ApiResponse<ContentInterface>> {
    try {
      return this.http.get<ApiResponse<ContentInterface>>(`api/content/${slug}`);
    } catch (e) {
      return of({
        success: false,
        error: e as Error
      });
    }
  }

  public getContentTypes$(): Observable<ApiResponse<ContentType[]>> {
    try {
      return this.http.get<ApiResponse<ContentType[]>>(`api/content/types`);
    } catch (e) {
      return of({
        success: false,
        error: e as Error
      });
    }
  }

  public createContent$(content: ContentInterface): Observable<ApiResponse<ContentInterface>> {
    try {
      return this.http.post<ApiResponse<ContentInterface>>(`api/content/`, content);
    } catch (e) {
      return of({
        success: false,
        error: e as Error
      });
    }
  }

  public updateContent$(content: ContentInterface): Observable<ApiResponse<ContentInterface>> {
    try {
      return this.http.put<ApiResponse<ContentInterface>>(`api/update`, content);
    } catch (e) {
      return of({
        success: false,
        error: e as Error
      });
    }
  }
}
