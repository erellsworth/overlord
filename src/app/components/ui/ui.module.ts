import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill';

import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

import { HeaderComponent } from './header/header.component';
import { PhoenicianComponent } from './phoenician/phoenician.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  entryComponents: [
    HeaderComponent,
    PhoenicianComponent
  ],
  declarations: [
    HeaderComponent,
    PhoenicianComponent
  ],
  imports: [
    CommonModule,
    QuillModule.forRoot(),
    FormsModule,
    MatInputModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule

  ],
  exports: [
    HeaderComponent,
    PhoenicianComponent,
    MatInputModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule
  ]
})
export class UiModule { }
