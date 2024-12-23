import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { ContentInterface } from '../../../interfaces/content';
import { firstValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import {
  ApiResponse,
  PaginatedApiResponse,
  PaginatedResults,
} from '../../../interfaces/misc';
import { OverlordContentType } from '../../../interfaces/overlord.config';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  public activeContent = signal<ContentInterface>({} as ContentInterface);
  public contentTypes = computed(() => this.configService.contentTypes());
  public contentTypeSlugs = computed(() => {
    return this.contentTypes()
      .map((ct) => ct.slug)
      .filter((slug) => Boolean(slug)) as string[];
  });

  public contentLists = signal<{
    [key: string]: PaginatedResults<ContentInterface>;
  }>({});

  constructor(
    private configService: ConfigService,
    private http: HttpClient,
  ) {}

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

  public async fetchContent(contentType: string, slug?: string): Promise<void> {
    if (!slug) {
      this.activeContent.set({
        ...this.getDefaultContent(contentType),
        ...{
          type: contentType,
        },
      });
      return;
    }
    const result = await firstValueFrom(
      this.http.get<ApiResponse<ContentInterface>>(`api/content/${slug}`),
    );

    if (result.success) {
      this.activeContent.set(result.data as ContentInterface);
    } else {
      console.error('Error fetching content', result.error);
    }
  }

  public getContentTypeBySlug(slug: string): OverlordContentType | undefined {
    return this.contentTypes().find((ct) => ct.slug === slug);
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

  private getDefaultContent(type: string): ContentInterface {
    const contentType = this.getContentTypeBySlug(type);

    const title = contentType?.noTitle ? uuidv4() : '';
    const slug = contentType?.noTitle ? title : '';

    return {
      title,
      type,
      slug,
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
  }
}
