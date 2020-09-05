import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentRoutingModule } from './content-routing.module';
import { ContentComponent } from './content.component';
import { UiModule } from '../../../components/ui/ui.module';
import { SharedModule } from '../../../components/shared.module';


@NgModule({
  declarations: [ContentComponent],
  imports: [
    CommonModule,
    ContentRoutingModule,
    UiModule,
    SharedModule
  ]
})
export class ContentModule { }
