import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  AngularFireAuthGuard,
  redirectLoggedInTo,
  customClaims
} from '@angular/fire/auth-guard';
import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';

const redirectLoggedInToDashboard = () => redirectLoggedInTo(['']);
const adminOnly = () => pipe(customClaims, map(claims => claims.admin === true ? true : ['login']));

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: adminOnly },
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'content/:id',
        loadChildren: () => import('./pages/dashboard/content/content.module').then(m => m.ContentModule)
      },
      {
        path: 'contents/:type/:action',
        loadChildren: () => import('./pages/dashboard/contents/contents.module').then(m => m.ContentsModule)
      },
      {
        path: 'contents/:type',
        loadChildren: () => import('./pages/dashboard/contents/contents.module').then(m => m.ContentsModule)
      }
    ]
  },
  {
    path: 'login',
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectLoggedInToDashboard },
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
