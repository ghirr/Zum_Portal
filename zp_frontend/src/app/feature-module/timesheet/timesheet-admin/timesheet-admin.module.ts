import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimesheetAdminRoutingModule } from './timesheet-admin-routing.module';
import { ProjectListComponent } from './project-list/project-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { SharedModule } from 'src/app/shared/shared.module';
import { TimesheetListComponent } from './timesheet-list/timesheet-list.component';


@NgModule({
  declarations: [
    ProjectListComponent,
    TimesheetListComponent
  ],
  imports: [
    CommonModule,
    TimesheetAdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatSortModule,
    MatTableModule,
    SharedModule
  ]
})
export class TimesheetAdminModule { }
