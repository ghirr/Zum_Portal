import { BehaviorSubject } from 'rxjs';

export class routes {
  public static layoutDirection: BehaviorSubject<string> =
    new BehaviorSubject<string>(localStorage.getItem('rtl') || '');
  private static Url = '';
  static rtl = this.layoutDirection.subscribe((res: string) => {
    this.Url = res;
  });


  public static get baseUrl(): string {
    return this.Url;
  }
  /* ------added by islem  */
  public static get customerPage(): string {
    return this.baseUrl + '/customers/customer-page';
  }
  public static get login1(): string {
    return this.baseUrl + '/authentication/login';
  }
  public static get forgot_password1(): string {
    return this.baseUrl + '/authentication/forgot-password';
  }
  public static get reset_password(): string {
    return this.baseUrl + '/authentication/reset_password';
  }
  public static get timesheetEmployee(): string {
    return this.baseUrl + '/timesheet/employee/timesheet-list/';
  }
  public static get timesheetAdmin(): string {
    return this.baseUrl + '/timesheet/admin/timesheet-list/';
  }
  public static get timesheetEmployeeProject(): string {
    return this.baseUrl + '/timesheet/employee/project-list/';
  }
  public static get timesheetAdminProject(): string {
    return this.baseUrl + '/timesheet/admin/project-list/';
  }
  public static get leaveApprovels(): string {
    return this.baseUrl + '/employees/leaves-approvels';
  }
  public static get RolePermissions(): string {
    return this.baseUrl + '/settings/roles_permissions';
  }
  public static get MettingRooms(): string {
    return this.baseUrl + '/settings/meeting_rooms';
  }
  public static get employeesContracts(): string {
    return this.baseUrl + '/employees/contracts';
  }
  /* ------added by islem  */
  public static get login(): string {
    return this.baseUrl + '/login';
  }
  public static get forgot_password(): string {
    return this.baseUrl + '/forgot-password';
  }
  public static get register(): string {
    return this.baseUrl + '/register';
  }
  public static get lock_screen(): string {
    return this.baseUrl + '/lock-screen';
  }
  public static get dashboard(): string {
    return this.baseUrl + '/dashboard';
  }
  public static get baseUi(): string {
    return this.baseUrl + '/base-ui';
  }

  public static get admin(): string {
    return this.baseUrl + '/dashboard/admin';
  }
  public static get employee(): string {
    return this.baseUrl + '/dashboard/employee';
  }
  public static get apps(): string {
    return this.baseUrl + '/apps';
  }
  public static get chat(): string {
    return this.baseUrl + '/apps/chats';
  }
  public static get voicecall(): string {
    return this.baseUrl + '/apps/voice-call';
  }
  public static get videocall(): string {
    return this.baseUrl + '/apps/video-call';
  }
  public static get outgoingcall(): string {
    return this.baseUrl + '/apps/outgoing-call';
  }
  public static get incomingcall(): string {
    return this.baseUrl + '/apps/incoming-call';
  }
  public static get contacts(): string {
    return this.baseUrl + '/apps/contacts';
  }
  public static get calendar(): string {
    return this.baseUrl + '/apps/calendar';
  }
  public static get email(): string {
    return this.baseUrl + '/apps/email';
  }
  public static get filemanager(): string {
    return this.baseUrl + '/apps/file-manager';
  }
  public static get employees(): string {
    return this.baseUrl + '/employees';
  }
  public static get employeesProject(): string {
    return this.baseUrl + '/employees';
  }
  public static get employee_page(): string {
    return this.baseUrl + '/employees/employee-page';
  }
  public static get employee_list(): string {
    return this.baseUrl + '/employees/employee-list';
  }
  public static get holidays(): string {
    return this.baseUrl + '/employees/holidays';
  }
  public static get leaveadmin(): string {
    return this.baseUrl + '/employees/leave-admin';
  }
  public static get leaveemployee(): string {
    return this.baseUrl + '/employees/leave-employee';
  }
  public static get leaveasdmin(): string {
    return this.baseUrl + '/employees/all-leaves-admin';
  }
  public static get leavesemployee(): string {
    return this.baseUrl + '/employees/all-leaves-emlployee';
  }
  public static get leavesettings(): string {
    return this.baseUrl + '/employees/leave-settings';
  }
  public static get attendanceadmin(): string {
    return this.baseUrl + '/employees/attendance-admin';
  }
  public static get timesheet(): string {
    return this.baseUrl + '/employees/timesheet';
  }
  public static get shiftschedule(): string {
    return this.baseUrl + '/employees/shift-schedule';
  }
  public static get clientPage(): string {
    return this.baseUrl + '/clients/client-page';
  }
  public static get projects(): string {
    return this.baseUrl + '/projects';
  }
 
  public static get projectpage(): string {
    return this.baseUrl + '/projects/project-page';
  }
  public static get tasks(): string {
    return this.baseUrl + '/projects/tasks';
  }
  public static get taskboard(): string {
    return this.baseUrl + '/projects/task-board';
  }

  public static get profile(): string {
    return this.baseUrl + '/profile';
  }
  public static get employeeProfile(): string {
    return this.baseUrl + '/employees/employee-profile';
  }
  public static get clientProfile(): string {
    return this.baseUrl + '/clients/client-profile';
  }
  public static get error(): string {
    return this.baseUrl + '/404';
  }
  public static get errors(): string {
    return this.baseUrl + '/500';
  }

  public static get adminDashboard(): string {
    return this.baseUrl + '/dashboard/admin';
  }
  public static get projectView(): string {
    return this.baseUrl + '/projects/project-view';
  }
  public static get projectList(): string {
    return this.baseUrl + '/projects/project-list';
  }


}
