import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { EmployeesRoutingModule } from './employees-routing.module';
import { EmployeesComponent } from './employees.component';
import { EmployeeProfileComponent } from './all-employee/employee-profile/employee-profile.component';
import { EmployeeListComponent } from './all-employee/employee-list/employee-list.component';
import { EmployeePageContentComponent } from './all-employee/employee-page-content/employee-page-content.component';
import { EmployeeModalComponent } from './all-employee/employee-modal/employee-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LeaveSettingsComponent } from './leave-settings/leave-settings.component';
import { AttendanceAdminComponent } from './attendance-admin/attendance-admin.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { OrdinalPipe } from './pipe/ordinal.pipe';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ToastrModule } from 'ngx-toastr';
import { PreventLeadingSpaceDirective } from '../../Common/directives/prevent-leading-space.directive';
import { LeavesEmployeeComponent } from './leaves/leaves-employee/leaves-employee.component';
import { TableLeaveComponent } from './leaves/table-leave/table-leave.component';
import { TableTTComponent } from './leaves/table-tt/table-tt.component';
import { TableExitauthorizationComponent } from './leaves/table-exitauthorization/table-exitauthorization.component';
import { LeavesAdminComponent } from './leaves/leaves-admin/leaves-admin.component';
import { TableAdminLeaveComponent } from './leaves/table-admin-leave/table-admin-leave.component';
import { TableAdminTTComponent } from './leaves/table-admin-tt/table-admin-tt.component';
import { TableAdminExitComponent } from './leaves/table-admin-exit/table-admin-exit.component';
import { LeavesApprovalsComponent } from './leaves-approvals/leaves-approvals.component';
import { ExitApprovalsComponent } from './leaves-approvals/exit-approvals/exit-approvals.component';
import { TtApprovalsComponent } from './leaves-approvals/tt-approvals/tt-approvals.component';
import { MeetingRoomApprovalsComponent } from './leaves-approvals/meeting-room-approvals/meeting-room-approvals.component';
import { EmployeeContractsComponent } from './employee-contracts/employee-contracts.component';
import { ShiftScheduleComponent } from './shift-schedule/shift-schedule.component';


@NgModule({
  declarations: [
    EmployeesComponent,
    EmployeeProfileComponent,
    EmployeeListComponent,
    EmployeePageContentComponent,
    EmployeeModalComponent,
    LeaveSettingsComponent,
    AttendanceAdminComponent,
    OrdinalPipe,
    PreventLeadingSpaceDirective,
    LeavesEmployeeComponent,
    TableLeaveComponent,
    TableTTComponent,
    TableExitauthorizationComponent,
    LeavesAdminComponent,
    TableAdminLeaveComponent,
    TableAdminTTComponent,
    TableAdminExitComponent,
    LeavesApprovalsComponent,
    ExitApprovalsComponent,
    TtApprovalsComponent,
    MeetingRoomApprovalsComponent,
    EmployeeContractsComponent,
    ShiftScheduleComponent
  ],
  imports: [
    CommonModule,
    EmployeesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ToastrModule.forRoot(),
    BsDatepickerModule.forRoot()

  ],
  providers: [DatePipe]
})
export class EmployeesModule { }
