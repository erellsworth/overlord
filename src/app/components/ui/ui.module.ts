import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
    CommonModule
  ],
  exports: [
    HeaderComponent,
    PhoenicianComponent
  ]
})
export class UiModule { }
