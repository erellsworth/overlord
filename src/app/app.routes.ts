import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ContentFormComponent } from './dashboard/content-form/content-form.component';
import { ContentListComponent } from './dashboard/content-list/content-list.component';

export const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        children: [
            {
                path: '',
                component: ContentFormComponent
            },
            {
                path: 'content/:contentType',
                component: ContentListComponent
            },
            {
                path: 'edit/:slug',
                component: ContentFormComponent
            },
            {
                path: 'create/:contentType',
                component: ContentFormComponent
            },
        ]
    }
];
