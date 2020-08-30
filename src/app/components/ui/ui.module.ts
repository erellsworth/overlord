import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill'

import { HeaderComponent } from './header/header.component';
import { PhoenicianComponent } from './phoenician/phoenician.component';


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
    QuillModule.forRoot()
  ],
  exports: [
    HeaderComponent,
    PhoenicianComponent
  ]
})
export class UiModule { }
