import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectListComponent } from './project-list/project-list.component';
import { TimesheetListComponent } from './timesheet-list/timesheet-list.component';

const routes: Routes = [
  {
    path:'project-list',
    component:ProjectListComponent
  },
  {
    path:'timesheet-list/:id',
    component:TimesheetListComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimesheetEmployeeRoutingModule { }
