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
  public contentTypes = signal<OverlordContentType[]>([]);
  public contentTypeSlugs = computed<string[]>(() =>
    this.contentTypes().map((ct) => ct.slug as string),
  );

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

  public async fetchContentTypes(): Promise<void> {
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

  private getDefaultContent(type: string): ContentInterface {
    const noTitle = this.configService.config().contentTypes[type]?.noTitle;

    const title = noTitle ? uuidv4() : '';
    const slug = noTitle ? title : '';

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
