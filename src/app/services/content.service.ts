import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { ContentInterface } from '../../../interfaces/content';
import { firstValueFrom, Observable, of } from 'rxjs';
import {
  ApiResponse,
  PaginatedApiResponse,
  PaginatedResults,
} from '../../../interfaces/misc';
import { OverlordContentType } from '../../../interfaces/overlord.config';
import { NavigationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  private defaultContent: ContentInterface = {
    title: '',
    type: 'post',
    slug: '',
    status: 'draft',
    text: '',
    html: '',
    content: null,
    seo: {
      description: '',
    },
    metaData: {
      media_id: 0,
      wordCount: 0,
    },
    Revisions: [],
  };
  public activeContent = signal<ContentInterface>(this.defaultContent);
  public contentTypes = signal<OverlordContentType[]>([]);
  public contentTypeSlugs = computed<string[]>(() =>
    this.contentTypes().map((ct) => ct.slug as string),
  );

  public contentLists = signal<{
    [key: string]: PaginatedResults<ContentInterface>;
  }>({});

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.activeContent.set(this.defaultContent);
      }
    });
    this.fetchContentTypes();
  }

  public async autoSave(
    content: ContentInterface,
  ): Promise<ApiResponse<ContentInterface>> {
    try {
      const data: ContentInterface = {
        ...content,
        ...{
          metaData: {
            ...content.metaData,
            ...{
              isAutoSave: true,
            },
          },
        },
      };

      const result = await firstValueFrom(
        this.http.post<ApiResponse<ContentInterface>>(
          `api/content/autosave`,
          data,
        ),
      );

      return result;
    } catch (e) {
      return {
        success: false,
        error: e as Error,
      };
    }
  }

  public async createContent(
    content: ContentInterface,
  ): Promise<ApiResponse<ContentInterface>> {
    try {
      return firstValueFrom(
        this.http.post<ApiResponse<ContentInterface>>(`api/content/`, content),
      );
    } catch (e) {
      return {
        success: false,
        error: e as Error,
      };
    }
  }

  public async fetchContentsByType(
    type: string,
    page: number = 1,
  ): Promise<void> {
    try {
      const result = await firstValueFrom(
        this.http.get<PaginatedApiResponse<ContentInterface>>(
          `api/content/type/${type}`,
        ),
      );

      if (result.success) {
        this.contentLists.update((list) => {
          list[type] = result.data as PaginatedResults<ContentInterface>;
          return list;
        });
      } else {
        console.error('Failed to fetch contents', result.error);
      }
    } catch (e) {
      console.error('Error fetching contents', e);
    }
  }

  public async deleteContent(
    id: number,
  ): Promise<ApiResponse<ContentInterface>> {
    try {
      return firstValueFrom(
        this.http.delete<ApiResponse<ContentInterface>>(`api/content/${id}`),
      );
    } catch (e) {
      return {
        success: false,
        error: e as Error,
      };
    }
  }

  public getContentByType$(
    type: string = 'post',
  ): Observable<PaginatedApiResponse<ContentInterface>> {
    try {
      return this.http.get<PaginatedApiResponse<ContentInterface>>(
        `api/content/type/${type}`,
      );
    } catch (e) {
      return of({
        success: false,
        error: e as Error,
      });
    }
  }

  public getContentBySlug$(
    slug: string,
  ): Observable<ApiResponse<ContentInterface>> {
    try {
      return this.http.get<ApiResponse<ContentInterface>>(
        `api/content/${slug}`,
      );
    } catch (e) {
      return of({
        success: false,
        error: e as Error,
      });
    }
  }

  public async fetchContent(slug: string): Promise<void> {
    const result = await firstValueFrom(
      this.http.get<ApiResponse<ContentInterface>>(`api/content/${slug}`),
    );

    if (result.success) {
      this.activeContent.set(result.data as ContentInterface);
    } else {
      console.error('Error fetching content', result.error);
    }
  }
  public async updateContent(
    content: ContentInterface,
  ): Promise<ApiResponse<ContentInterface>> {
    try {
      return firstValueFrom(
        this.http.put<ApiResponse<ContentInterface>>(`api/content`, content),
      );
    } catch (e) {
      return {
        success: false,
        error: e as Error,
      };
    }
  }

  private async fetchContentTypes(): Promise<void> {
    try {
      const result = await firstValueFrom(
        this.http.get<ApiResponse<OverlordContentType[]>>(`api/content/types`),
      );

      if (result.success) {
        this.contentTypes.set(result.data as OverlordContentType[]);
      } else {
        console.error('Problem fetching content types', result.error);
      }
    } catch (e) {
      console.error('Problem fetching content types', e);
    }
  }
}
