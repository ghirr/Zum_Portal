import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { EmployeeDashboardComponent } from './employee-dashboard/employee-dashboard.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [DashboardComponent, AdminDashboardComponent, EmployeeDashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NgApexchartsModule,
    NgChartsModule

  ]
})
export class DashboardModule { }
