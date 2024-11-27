import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ContentFormComponent } from './dashboard/content-form/content-form.component';
import { ContentListComponent } from './dashboard/content-list/content-list.component';
import { configResolver } from './config.resolver';
import { contentResolver } from './content.resolver';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    resolve: { configResolver },
    children: [
      {
        path: '',
        component: ContentFormComponent,
        resolve: { contentResolver },
      },
      {
        path: 'content/:contentType',
        component: ContentListComponent,
        resolve: { contentResolver },
      },
      {
        path: 'edit/:slug',
        component: ContentFormComponent,
        resolve: { contentResolver },
      },
      {
        path: 'create/:contentType',
        component: ContentFormComponent,
        resolve: { contentResolver },
      },
    ],
  },
];
