import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import {
  ApiResponse,
  PaginatedApiResponse,
  PaginatedResults,
  ContentInterface,
  ContentMetaData,
  ContentSeo,
  OverlordContentType,
  OverlordField,
} from '@overlord/types';
import { firstValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

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
    params: any = {},
  ): Promise<void> {
    try {
      const result = await firstValueFrom(
        this.http.get<PaginatedApiResponse<ContentInterface>>(
          `api/content/type/${type}/${page}`,
          { params },
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

  public async fetchContent(
    contentType: string,
    slug?: string,
    params?: any,
  ): Promise<void> {
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
      this.http.get<ApiResponse<ContentInterface>>(`api/content/${slug}`, {
        params,
      }),
    );

    if (result.success) {
      this.setContent(result.data as ContentInterface);
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

    const { metaData, seo } = this.getDefaults(type);

    return {
      title,
      type,
      slug,
      status: 'draft',
      text: '',
      html: '',
      content: null,
      seo,
      metaData,
      Revisions: [],
    };
  }

  private getDefaults(type: string) {
    const metaData: ContentMetaData = {
      media_id: 0,
      wordCount: 0,
    };
    const seo: ContentSeo = { description: '' };

    const contentType = this.getContentTypeBySlug(type);
    contentType?.fields?.forEach((field) => {
      const _field = field as OverlordField;
      if (_field.group === 'metaData') {
        metaData[_field.name] = this.getDefaultValue(_field);
      }

      if (_field.group === 'seo') {
        seo[_field.name] = this.getDefaultValue(_field);
      }
    });

    return {
      metaData,
      seo,
    };
  }

  private getDefaultValue(field: OverlordField) {
    if (typeof field.defaultValue !== 'undefined') {
      return field.defaultValue;
    }
    const numTypes = ['image', 'number', 'rating'];
    if (numTypes.includes(field.type)) {
      return 0;
    }

    if (field.type === 'boolean') {
      return false;
    }

    return '';
  }

  private setContent(content: ContentInterface) {
    const { metaData, seo } = this.getDefaults(content.type);

    content.metaData = { ...metaData, ...content.metaData };
    content.seo = { ...seo, ...content.seo };

    this.activeContent.set(content);
  }
}
