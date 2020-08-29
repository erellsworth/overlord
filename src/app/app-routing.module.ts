import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  AngularFireAuthGuard,
  redirectLoggedInTo,
  customClaims
} from '@angular/fire/auth-guard';
import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';

const redirectLoggedInToDashboard = () => redirectLoggedInTo(['dashboard']);
const adminOnly = () => pipe(customClaims, map(claims => claims.admin === true ? true : ['login']));

const routes: Routes = [
  { path: '', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) },
  {
    path: 'dashboard',
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: adminOnly },
    loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule)
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
