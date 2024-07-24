import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListComponent } from './all-employee/employee-list/employee-list.component';
import { EmployeePageContentComponent } from './all-employee/employee-page-content/employee-page-content.component';
import { EmployeeProfileComponent } from './all-employee/employee-profile/employee-profile.component';
import { AttendanceAdminComponent } from './attendance-admin/attendance-admin.component';
import { EmployeesComponent } from './employees.component';
import { LeaveSettingsComponent } from './leave-settings/leave-settings.component';
import { LeavesEmployeeComponent } from './leaves/leaves-employee/leaves-employee.component';
import { LeavesAdminComponent } from './leaves/leaves-admin/leaves-admin.component';

import { LeavesApprovalsComponent } from './leaves-approvals/leaves-approvals.component';
import { AdminTalentGeneralguard } from 'src/app/Common/guards/admin-or-talentmanagement-or-general-manager.guard';
import { SimpleOrScrumOrProject } from 'src/app/Common/guards/simpe-or-scrum-or-project-manager.guard';
import { GeneralOrTalentOrScrumOrProject } from 'src/app/Common/guards/talent-or-general-or-scrum-or-project-manager.guard';
import { EmployeeContractsComponent } from './employee-contracts/employee-contracts.component';
import { ShiftScheduleComponent } from './shift-schedule/shift-schedule.component';
import { AdminTalentGeneralProjectguard } from 'src/app/Common/guards/admin-or-talentmanagement-or-general-manager-or-project-manager.guard.spec';

const routes: Routes = [
  { 
  path: '', 
  component: EmployeesComponent,
  children: [
    { path: "employee-list", component: EmployeeListComponent,canActivate:[AdminTalentGeneralProjectguard] },
    { path: "employee-page", component: EmployeePageContentComponent,canActivate:[AdminTalentGeneralProjectguard] },
    { path: "employee-profile/:id", component: EmployeeProfileComponent },
    { path: "leave-settings", component: LeaveSettingsComponent,canActivate:[AdminTalentGeneralguard] },
    { path: "attendance-admin", component: AttendanceAdminComponent,canActivate:[AdminTalentGeneralguard] },
    { path: "all-leaves-emlployee", component: LeavesEmployeeComponent,canActivate:[SimpleOrScrumOrProject] },
    { path: "all-leaves-admin", component: LeavesAdminComponent,canActivate:[AdminTalentGeneralguard] },
    { path: 'leaves-approvels', component: LeavesApprovalsComponent,canActivate:[GeneralOrTalentOrScrumOrProject] },
    { path: 'contracts',component:EmployeeContractsComponent,canActivate:[AdminTalentGeneralguard]},
    { path: 'shift-schedule',component:ShiftScheduleComponent,canActivate:[AdminTalentGeneralguard]}
  ],
 }];
 
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeesRoutingModule { }
