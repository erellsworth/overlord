import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UiModule } from '../../components/ui/ui.module'
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';


@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    UiModule
  ]
})
export class DashboardModule { }
