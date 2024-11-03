import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ContentInterface, ContentType } from '../../../interfaces/content';
import { firstValueFrom, Observable, of } from 'rxjs';
import { ApiResponse, PaginatedApiResponse } from '../../../interfaces/misc';
import { OverlordContentType } from '../../../interfaces/overlord.config';

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  constructor(private http: HttpClient) {}

  public async autoSave(
    content: ContentInterface
  ): Promise<ApiResponse<ContentInterface>> {
    try {
      return firstValueFrom(
        this.http.put<ApiResponse<ContentInterface>>(
          `api/content/autosave`,
          content
        )
      );
    } catch (e) {
      return {
        success: false,
        error: e as Error,
      };
    }
  }

  public async createContent(
    content: ContentInterface
  ): Promise<ApiResponse<ContentInterface>> {
    try {
      return firstValueFrom(
        this.http.post<ApiResponse<ContentInterface>>(`api/content/`, content)
      );
    } catch (e) {
      return {
        success: false,
        error: e as Error,
      };
    }
  }

  public async deleteContent(
    id: number
  ): Promise<ApiResponse<ContentInterface>> {
    try {
      return firstValueFrom(
        this.http.delete<ApiResponse<ContentInterface>>(`api/content/${id}`)
      );
    } catch (e) {
      return {
        success: false,
        error: e as Error,
      };
    }
  }

  public getContentByType$(
    type: string = 'post'
  ): Observable<PaginatedApiResponse<ContentInterface>> {
    try {
      return this.http.get<PaginatedApiResponse<ContentInterface>>(
        `api/content/type/${type}`
      );
    } catch (e) {
      return of({
        success: false,
        error: e as Error,
      });
    }
  }

  public getContentBySlug$(
    slug: string
  ): Observable<ApiResponse<ContentInterface>> {
    try {
      return this.http.get<ApiResponse<ContentInterface>>(
        `api/content/${slug}`
      );
    } catch (e) {
      return of({
        success: false,
        error: e as Error,
      });
    }
  }

  public getContentTypes$(): Observable<ApiResponse<OverlordContentType[]>> {
    try {
      return this.http.get<ApiResponse<OverlordContentType[]>>(
        `api/content/types`
      );
    } catch (e) {
      return of({
        success: false,
        error: e as Error,
      });
    }
  }

  public async updateContent(
    content: ContentInterface
  ): Promise<ApiResponse<ContentInterface>> {
    try {
      return firstValueFrom(
        this.http.put<ApiResponse<ContentInterface>>(`api/update`, content)
      );
    } catch (e) {
      return {
        success: false,
        error: e as Error,
      };
    }
  }
}
