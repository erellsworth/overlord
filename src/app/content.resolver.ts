import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ContentService } from './services/content.service';

export const contentResolver: ResolveFn<boolean> = async (route, state) => {
  const contentService = inject(ContentService);
  await contentService.fetchContentTypes();
  const contentType = route.paramMap.get('contentType') || 'post';
  const slug = route.paramMap.get('slug') || undefined;
  await contentService.fetchContent(contentType, slug);
  return true;
};
