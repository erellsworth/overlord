import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ContentService } from './services/content.service';
import { FormService } from './dashboard/form.service';

export const contentResolver: ResolveFn<boolean> = async (route, state) => {
  const contentService = inject(ContentService);
  const formService = inject(FormService);
  await contentService.fetchContentTypes();
  const contentType = route.paramMap.get('contentType') || 'post';
  const slug = route.paramMap.get('slug') || undefined;
  await contentService.fetchContent(contentType, slug);
  formService.prepareForm(contentService.activeContent());
  return true;
};
