import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentsRoutingModule } from './contents-routing.module';
import { ContentsComponent } from './contents.component';
import { UiModule } from '../../../components/ui/ui.module';
import { SharedModule } from '../../../components/shared.module';

@NgModule({
  declarations: [ContentsComponent],
  imports: [
    CommonModule,
    ContentsRoutingModule,
    UiModule,
    SharedModule
  ]
})
export class ContentsModule { }
