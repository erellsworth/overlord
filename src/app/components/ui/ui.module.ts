import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill';

import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';


import { HeaderComponent } from './header/header.component';
import { PhoenicianComponent } from './phoenician/phoenician.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ErrorComponent } from './error/error.component';
import { MediaSelectorComponent } from './media-selector/media-selector.component';

@NgModule({
  entryComponents: [
    HeaderComponent,
    PhoenicianComponent
  ],
  declarations: [
    HeaderComponent,
    PhoenicianComponent,
    ErrorComponent,
    MediaSelectorComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    QuillModule.forRoot(),
    FormsModule,
    MatInputModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatMenuModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  exports: [
    HeaderComponent,
    PhoenicianComponent,
    MatInputModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatMenuModule,
    MatSnackBarModule,
    MatDialogModule
  ]
})
export class UiModule { }
