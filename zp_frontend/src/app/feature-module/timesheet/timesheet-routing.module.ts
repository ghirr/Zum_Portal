import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TimesheetComponent } from './timesheet/timesheet.component';
import { AdminTalentGeneralguard } from 'src/app/Common/guards/admin-or-talentmanagement-or-general-manager.guard';
import { SimpleOrScrumOrProject } from 'src/app/Common/guards/simpe-or-scrum-or-project-manager.guard';

const routes: Routes = [
  {
    path:'',
    component:TimesheetComponent,
    children: [
  {
    path: 'employee',
    canActivate: [SimpleOrScrumOrProject],
    loadChildren: () =>
      import('./timesheet-employee/timesheet-employee.module').then((m) => m.TimesheetEmployeeModule),
  },
  
  {
    path: 'admin',
    canActivate: [AdminTalentGeneralguard],
    loadChildren: () =>
      import('./timesheet-admin/timesheet-admin.module').then((m) => m.TimesheetAdminModule),
  }
]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimesheetRoutingModule { }
