import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, map } from 'rxjs';
import {
  SideBar,
  SideBarMenu,
  apiResultFormat,
  routes,
} from '../../core.index';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class DataService {
  allAppliedCandidates!: Array<object>;

  constructor(private http: HttpClient) {}

  public getEmployees(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/employee.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getallAppliedCandidates(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/applied-candidate.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getholidays(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/holidays.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getLeave(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/leave-admin.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getDepartment(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/department.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getDesignations(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/designation.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getTimeSheet(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/timesheet.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getShiftSchedule(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/shift.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getShiftList(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/shiftlist.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getOverTime(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/overtime.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getClient(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/clients.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getProjects(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/projects.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getLeads(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/leads.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getTickets(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/tickets.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getEstimate(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/estimates.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getInvoice(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/invoice-page.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getPayment(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/payments.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getExpenses(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/expenses.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getProvidentFund(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/provident-fund.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getTaxes(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/taxes.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getCategories(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/categories.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getBudgets(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/budgets.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getEmployeeSalary(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/employee-salary.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getAddPayroll1(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/payroll-item1.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getAddPayroll2(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/payroll-item2.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getAddPayroll3(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/payroll-item3.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getPolicies(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/policies.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getExpenseReport(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/expense-report.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getInvoiceReport(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/invoice-report.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getPaymentReport(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/payment-report.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getProjectReport(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/project-report.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }

  public getTaskReport(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/task-report.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getUserReport(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/user-report.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getEmployeeReport(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/employee-report.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getPayslipReport(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/payslip-report.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getAttendancepReport(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/attendance-report.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getAttendReport(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/attend-report.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getLeaveReport(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/leave-report.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getDailyReport(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/daily-report.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getPerformanceReport(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/performance-indicator.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getPerformanceappraisal(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/performance-appraisal.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getGoalList(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/goal-list.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getGoalType(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/goal-type.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getTrainList(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/training-list.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getTrainType(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/training-type.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getTrainer(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/trainers.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getPromotion(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/promotion.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getResignation(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/resignation.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getTermination(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/termination.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getAssets(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/assets-page.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getAllJobs(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/user-dashboard-all.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getSavedJobs(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/user-dashboard-saved.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getAppliedJobs(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/user-dashboard-applied.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getOfferedJobs(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/user-dashboard-offered.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getVisited(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/user-dashboard-visited.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getArchived(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/user-dashboard-archived.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getManageJobs(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/manage-jobs.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getManageResume(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/manage-resumes.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getShortList(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/shortlist-candidate.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getInterview(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/interview-questions.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getOffer(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/offer-approval.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getExpire(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/experience-level.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getSchedule(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/schedule-timing.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getCandidate(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/candidates-list.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getAptitudeResult(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/aptitude-result.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getAptitudeResults(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/aptitude-result.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getAptitudeCandidate(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/applied-candidate.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getUsers(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/users.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getSubscribed(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/subscribed-company.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getDataTable(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/form-tables.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getAssetsCategory(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/assets-category.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getAssetsNew(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/assets-new.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getAssetsReports(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/assets-reports.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getProjectContent(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/project-content.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getinterview(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/interview.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public sideBar: SideBar[] = [
    {
      tittle: 'Main',
      icon: 'airplay',
      showAsTab: false,
      separateRoute: false,
      menu: [
        {
          menuValue: 'Admin Dashboard',
          route: routes.admin,
          hasSubRoute: false,
          showSubRoute: false,
          icon: 'dashboard',
          base: 'dashboard',
          materialicons: 'home',
          allowedRoles: ['Admin','Talent Management','General Manager'], 
          subMenus: [],
        },
        {
          menuValue: 'Employee Dashboard',
          route: routes.employee,
          hasSubRoute: false,
          showSubRoute: false,
          icon: 'dashboard',
          base: 'dashboard_emp',
          materialicons: 'dashboard_emp',
          allowedRoles: ['Simple User','Scrum Master','Project Manager'], 
          subMenus: [
          ],
        },
        {
          menuValue: 'Calendar',
          route: routes.calendar,
          hasSubRoute: false,
          showSubRoute: false,
          icon: 'calendar',
          base: 'apps',
          materialicons: 'calendar',
          allowedRoles: ['Simple User','Scrum Master','Project Manager','Admin','Talent Management','General Manager'], 
          subMenus: [
          ],
        },
      ],
    },
    {
      tittle: 'Employees',
      icon: 'layers',
      showAsTab: false,
      separateRoute: false,
      menu: [
        {
          menuValue: 'Employees',
          route: routes.employee,
          hasSubRoute: true,
          showSubRoute: false,
          icon: 'user',
          base: 'employees',
          dot: true,
          materialicons: 'people',
          allowedRoles: ['Admin','Talent Management','General Manager'], 
          subMenus: [
            {
              menuValue: 'All Employees',
              route: routes.employee_page,
              base: 'employee-page',
              base2: 'employee-list',
            },
            {
              menuValue: 'Allocation',
              route: routes.shiftschedule,
              base: 'shift-schedule',
            },
            {
            menuValue: 'Contracts',
            route: routes.employeesContracts,
            base: 'contracts',
            },
          ],
        },
        {
          menuValue: 'Attendance',
          hasSubRoute: false,
          showSubRoute: false,
          route: routes.attendanceadmin,
          icon: 'thumbtack',
          base: 'presence',
          dot: true,
          materialicons: 'thumbtack',
          allowedRoles: ['Talent Management'], 
          subMenus:[]
        },
        // {
        //   menuValue: 'Employees',
        //   route: routes.employee_page,
        //   hasSubRoute: false,
        //   showSubRoute: false,
        //   icon: 'user',
        //   base: 'employeesProject',
        //   materialicons: 'people',
        //   allowedRoles: ['Project Manager'], 
        //   subMenus: [],
        // },
        {
          menuValue: 'Leaves',
          route : routes.leaveadmin,
          hasSubRoute: true,
          showSubRoute: false,
          icon: 'user-minus',
          base: 'leave-admin',
          materialicons: 'person',
          allowedRoles: ['Admin','Talent Management','General Manager'], 
          subMenus: [
            {
              menuValue: 'All Leaves',
              route: routes.leaveasdmin,
              base: 'leave-admin',
              currentActive: true,
            },
            {
              menuValue: 'Leave Settings',
              route: routes.leavesettings,
              base: 'leave-settings',
            },
          ]
        },
        {
          menuValue: 'All Leaves (Employee)',
          route: routes.leavesemployee,
          hasSubRoute: false,
          showSubRoute: false,
          icon: 'user-minus',
          base: 'leave-employee',
          materialicons: 'person',
          allowedRoles: ['Simple User','Scrum Master','Project Manager'], 
          subMenus: [],
        },
        {
          menuValue: 'Requests',
          route: routes.leaveApprovels,
          hasSubRoute: false,
          showSubRoute: false,
          icon: 'reply',
          base: 'leave-requests',
          materialicons: 'person',
          allowedRoles: ['Talent Management','General Manager','Project Manager','Scrum Master'], 
          subMenus: [],
        },
        {
          menuValue: 'Customers',
          route: routes.customerPage,
          hasSubRoute: false,
          showSubRoute: false,
          icon: 'users',
          base: 'customers',
          materialicons: 'person',
          allowedRoles: ['Admin','Talent Management','General Manager','Project Manager'], 
          subMenus: [],
        },
        {
          menuValue: 'Timesheet',
          route: routes.timesheetEmployeeProject,
          hasSubRoute: false,
          showSubRoute: false,
          icon: 'pen',
          base: 'Timesheet',
          materialicons: '',
          allowedRoles: ['Simple User','Scrum Master','Project Manager'], 
          subMenus: [],
        },
        {
          menuValue: 'Timesheet',
          route: routes.timesheetAdminProject,
          hasSubRoute: false,
          showSubRoute: false,
          icon: 'pencil',
          base: 'timesheet',
          materialicons: '',
          allowedRoles: ['Admin','Talent Management','General Manager'], 
          subMenus: [],
        },
        {
          menuValue: 'Role And Permissions',
          route: routes.RolePermissions,
          hasSubRoute: false,
          showSubRoute: true,
          icon: 'eye',
          base: 'roles_permissions',
          materialicons: 'settings',
          allowedRoles: ['Admin'], 
          subMenus: [],
        },
        {
          menuValue: 'Meeting Rooms',
          route: routes.MettingRooms,
          hasSubRoute: false,
          showSubRoute: true,
          icon: 'door-closed',
          base: 'meeting_rooms',
          materialicons: 'shopping_bag',
          allowedRoles: ['Admin','Talent Management','General Manager'], 
          subMenus: [],
        },
        {
          menuValue: 'Projects',
          route: routes.projectpage,
          hasSubRoute: false,
          showSubRoute: false,
          icon: 'rocket',
          base: 'projects',
          materialicons: 'topic',
          allowedRoles: ['Admin','Talent Management','General Manager','Project Manager','Simple User','Scrum Master'], 
          subMenus: [
            // {
            //   menuValue: 'Projects',
            //   route: routes.projectpage,
             
            // },
            // { menuValue: 'Tasks', route: routes.tasks, base: 'tasks' },
            // {
            //   menuValue: 'Task Board',
            //   route: routes.taskboard,
            //   base: 'task-board',
            // },
          ],
        },
      ],
    },
    
  ];
  public getSideBarData: BehaviorSubject<Array<SideBar>> = new BehaviorSubject<Array<SideBar>>(this.sideBar);

public resetData(): void {
  this.sideBar.forEach((res: SideBar) => {
    res.showAsTab = false;
    res.menu.forEach((menus: SideBarMenu) => {
      menus.showSubRoute = false;
    });
  });
}
  allCustomPolicy = [
    {
      id: 1,
      name: 'John deo',
      days: 5,
    },
  ];

  companiesList = [
    {
      id: 1,
      company: 'Delta Infotech',
    },
    {
      id: 1,
      company: 'Delta Infotech',
    },
    {
      id: 1,
      company: 'Delta Infotech',
    },
    {
      id: 1,
      company: 'Delta Infotech',
    },
    {
      id: 1,
      company: 'Delta Infotech',
    },
  ];

  clientsDatas = [
    {
      name: 'Barry Cuda',
      role: 'CEO',
      company: 'Global Technologies',
      image: 'avatar-19',
      clientId: 'CLT-0008',
      email: 'barrycuda@example.com',
      phone: '9876543210',
      status: 'Active',
      id: 1,
      img: 'assets/img/profiles/avatar-19.jpg',
    },
    {
      name: 'Tressa Wexler',
      role: 'Manager',
      company: 'Delta Infotech',
      image: 'avatar-29',
      clientId: 'CLT-0003',
      email: 'tressawexler@example.com',
      phone: '9876543211',
      status: 'Inactive',
      id: 2,
      img: 'assets/img/profiles/avatar-29.jpg',
    },
    {
      name: 'Ruby Bartlett ',
      role: 'CEO',
      company: 'Cream Inc',
      image: 'avatar-07',
      clientId: 'CLT-0002',
      email: 'rubybartlett@example.com',
      phone: '9876543212',
      status: 'Inactive',
      id: 3,
      img: 'assets/img/profiles/avatar-07.jpg',
    },
    {
      name: 'Misty Tison',
      role: 'CEO',
      company: 'Wellware Company',
      image: 'avatar-06',
      clientId: 'CLT-0001',
      email: 'tisonmisty@example.com',
      phone: '9876543213',
      status: 'Inactive',
      id: 4,
      img: 'assets/img/profiles/avatar-06.jpg',
    },
    {
      name: 'Daniel Deacon',
      role: 'CEO',
      company: 'Mustang Technologies',
      image: 'avatar-14',
      clientId: 'CLT-0006',
      email: 'danieldeacon@example.com',
      phone: '9876543214',
      status: 'Active',
      id: 5,
      img: 'assets/img/profiles/avatar-14.jpg',
    },
    {
      name: 'Walter  Weaver',
      role: 'CEO',
      company: 'International Software',
      image: 'avatar-18',
      clientId: 'CLT-0007',
      email: 'walterweaver@example.com',
      phone: '9876543215',
      status: 'Active',
      id: 6,
      img: 'assets/img/profiles/avatar-18.jpg',
    },
    {
      name: 'Amanda Warren',
      role: 'CEO',
      company: 'Mercury Software Inc',
      image: 'avatar-28',
      clientId: 'CLT-0005',
      email: 'amandawarren@example.com',
      phone: '9876543216',
      status: 'Active',
      id: 7,
      img: 'assets/img/profiles/avatar-28.jpg',
    },
    {
      name: 'Bretty Carlson',
      role: 'CEO',
      company: 'Carlson Technologies',
      image: 'avatar-13',
      clientId: 'CLT-0004',
      email: 'bettycarlson@example.com',
      phone: '9876543217',
      status: 'Inactive',
      id: 8,
      img: 'assets/img/profiles/avatar-13.jpg',
    },
  ];

  projects = [
    {
      name: 'Office Management',
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. When an unknown printer took a galley of type and scrambled it...',
      endDate: '17-04-2023',
      startDate: '17-04-2023',
      priority: 'High',
      projectleader: 'Aravind',
      teamMember: 'Prakash',
      projectId: 'PRO-001',
      id: 1,
    },
    {
      name: 'Hospital Administration',
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. When an unknown printer took a galley of type and scrambled it...',
      endDate: '17-04-2023',
      startDate: '17-04-2023',
      priority: 'High',
      projectleader: 'Ashok',
      teamMember: 'Aravind',
      projectId: 'PRO-001',
      id: 2,
    },
    {
      name: 'Project Management',
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. When an unknown printer took a galley of type and scrambled it...',
      endDate: '17-08-2023',
      startDate: '17-07-2023',
      priority: 'High',
      projectleader: 'vijay',
      teamMember: 'prakash',
      projectId: 'PRO-001',
      id: 3,
    },
    {
      name: 'Video Calling App',
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. When an unknown printer took a galley of type and scrambled it...',
      endDate: '17-04-2023',
      startDate: '17-03-2023',
      priority: 'High',
      projectleader: 'Ashok',
      teamMember: 'Aravind',
      projectId: 'PRO-001',
      id: 4,
    },
    {
      name: 'Project Management',
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. When an unknown printer took a galley of type and scrambled it...',
      endDate: '17-08-2023',
      startDate: '17-07-2023',
      priority: 'High',
      projectleader: 'vijay',
      teamMember: 'prakash',
      projectId: 'PRO-001',
      id: 5,
    },
    {
      name: 'Office Management',
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. When an unknown printer took a galley of type and scrambled it...',
      endDate: '17-04-2023',
      startDate: '17-04-2023',
      priority: 'High',
      projectleader: 'Aravind',
      teamMember: 'Prakash',
      projectId: 'PRO-001',
      id: 6,
    },
  ];

  allKnowledgeBase = [
    {
      title: 'Installation & Activation',
      list1: 'Sed ut perspiciatis unde omnis?',
      list2: 'Sed ut perspiciatis unde omnis?',
      list3: 'Sed ut perspiciatis unde omnis?',
      list4: 'Sed ut perspiciatis unde omnis?',
      list5: 'Sed ut perspiciatis unde omnis?',
      id: 1,
    },
    {
      title: 'Premium Members Features',
      list1: 'Sed ut perspiciatis unde omnis?',
      list2: 'Sed ut perspiciatis unde omnis?',
      list3: 'Sed ut perspiciatis unde omnis?',
      list4: 'Sed ut perspiciatis unde omnis?',
      list5: 'Sed ut perspiciatis unde omnis?',
      id: 2,
    },
    {
      title: 'API Usage & Guide lines',
      list1: 'Sed ut perspiciatis unde omnis?',
      list2: 'Sed ut perspiciatis unde omnis?',
      list3: 'Sed ut perspiciatis unde omnis?',
      list4: 'Sed ut perspiciatis unde omnis?',
      list5: 'Sed ut perspiciatis unde omnis?',
      id: 3,
    },
    {
      title: 'Getting Started',
      list1: 'Sed ut perspiciatis unde omnis?',
      list2: 'Sed ut perspiciatis unde omnis?',
      list3: 'Sed ut perspiciatis unde omnis?',
      list4: 'Sed ut perspiciatis unde omnis?',
      list5: 'Sed ut perspiciatis unde omnis?',
      id: 4,
    },
    {
      title: 'Lorem ipsum dolor',
      list1: 'Sed ut perspiciatis unde omnis?',
      list2: 'Sed ut perspiciatis unde omnis?',
      list3: 'Sed ut perspiciatis unde omnis?',
      list4: 'Sed ut perspiciatis unde omnis?',
      list5: 'Sed ut perspiciatis unde omnis?',
      id: 5,
    },
    {
      title: 'Lorem ipsum dolor',
      list1: 'Sed ut perspiciatis unde omnis?',
      list2: 'Sed ut perspiciatis unde omnis?',
      list3: 'Sed ut perspiciatis unde omnis?',
      list4: 'Sed ut perspiciatis unde omnis?',
      list5: 'Sed ut perspiciatis unde omnis?',
      id: 6,
    },
    {
      title: 'Lorem ipsum dolor',
      list1: 'Sed ut perspiciatis unde omnis?',
      list2: 'Sed ut perspiciatis unde omnis?',
      list3: 'Sed ut perspiciatis unde omnis?',
      list4: 'Sed ut perspiciatis unde omnis?',
      list5: 'Sed ut perspiciatis unde omnis?',
      id: 7,
    },
    {
      title: 'Lorem ipsum dolor',
      list1: 'Sed ut perspiciatis unde omnis?',
      list2: 'Sed ut perspiciatis unde omnis?',
      list3: 'Sed ut perspiciatis unde omnis?',
      list4: 'Sed ut perspiciatis unde omnis?',
      list5: 'Sed ut perspiciatis unde omnis?',
      id: 8,
    },
    {
      title: 'Lorem ipsum dolor',
      list1: 'Sed ut perspiciatis unde omnis?',
      list2: 'Sed ut perspiciatis unde omnis?',
      list3: 'Sed ut perspiciatis unde omnis?',
      list4: 'Sed ut perspiciatis unde omnis?',
      list5: 'Sed ut perspiciatis unde omnis?',
      id: 9,
    },
  ];

  allroles = [
    {
      roleName: 'Administrator',
      id: 1,
    },
    {
      roleName: 'CEO',
      id: 2,
    },
    {
      roleName: 'Manager',
      id: 3,
    },
    {
      roleName: 'Team Leader',
      id: 4,
    },
    {
      roleName: 'Accountant',
      id: 5,
    },
    {
      roleName: 'Web Developer',
      id: 6,
    },
    {
      roleName: 'Web Designer',
      id: 7,
    },
    {
      roleName: 'HR',
      id: 8,
    },
    {
      roleName: 'UI/UX Developer',
      id: 9,
    },
    {
      roleName: 'SEO Analyst',
      id: 10,
    },
  ];

  allLeaveType = [
    {
      leaveType: 'Casual Leave',
      leaveDays: '12 Days',
      id: 1,
      status: 'Active',
    },
    {
      leaveType: 'Medical Leave',
      leaveDays: '12 Days',
      id: 2,
      status: 'Inactive',
    },
    {
      leaveType: 'Loss of Pay',
      leaveDays: '10 Days',
      id: 3,
      status: 'Active',
    },
  ];
  lstEmployee = [
    {
      firstname: 'John Doe',
      lastname: 'Manseau',
      username: 'Manseau',
      password: '123445',
      confirmpassword: '123456',
      department: 'software',
      designation: 'Web Designer',
      phone: '9842354254',
      email: 'catherine@example.com',
      mobile: '9876543210',
      joindate: '18-04-2013',
      role: 'Web Developer',
      employeeId: 'FT-0001',
      company: 'FT-0001',
      id: 1,
      img: 'assets/img/profiles/avatar-02.jpg',
    },
    {
      firstname: 'Richard Miles',
      lastname: 'Manseau',
      username: 'Manseau',
      password: '123445',
      confirmpassword: '123456',
      department: 'software',
      designation: 'Web Developer',
      phone: '9842354254',
      email: 'catherine@example.com',
      mobile: '9876543210',
      joindate: '18-04-2013',
      role: 'Web Developer',
      employeeId: 'FT-0001',
      company: 'FT-0001',
      id: 2,
      img: 'assets/img/profiles/avatar-09.jpg',
    },
    {
      firstname: 'John Smith',
      lastname: 'Manseau',
      username: 'Manseau',
      password: '123445',
      confirmpassword: '123456',
      department: 'software',
      designation: 'Android Developer',
      phone: '9842354254',
      email: 'catherine@example.com',
      mobile: '9876543210',
      joindate: '18-05-2013',
      role: 'Web Developer',
      employeeId: 'FT-0001',
      company: 'FT-0001',
      id: 3,
      img: 'assets/img/profiles/avatar-10.jpg',
    },
    {
      firstname: 'Mike Litorus',
      lastname: 'Manseau',
      username: 'Manseau',
      password: '123445',
      confirmpassword: '123456',
      department: 'software',
      designation: 'IOS Developer',
      phone: '9842354254',
      email: 'catherine@example.com',
      mobile: '9876543210',
      joindate: '18-04-2013',
      role: 'Web Developer',
      employeeId: 'FT-0001',
      company: 'FT-0001',
      id: 4,
      img: 'assets/img/profiles/avatar-05.jpg',
    },
    {
      firstname: 'Wilmer Deluna',
      lastname: 'Manseau',
      username: 'Manseau',
      password: '123445',
      confirmpassword: '123456',
      department: 'software',
      designation: 'Team Leader',
      phone: '9842354254',
      email: 'catherine@example.com',
      mobile: '9876543210',
      joindate: '18-04-2013',
      role: 'Web Developer',
      employeeId: 'FT-0001',
      company: 'FT-0001',
      id: 5,
      img: 'assets/img/profiles/avatar-01.jpg',
    },
    {
      firstname: 'Jeffrey Warden',
      lastname: 'Manseau',
      username: 'Manseau',
      password: '123445',
      confirmpassword: '123456',
      department: 'software',
      designation: 'Web  Developer',
      phone: '9842354254',
      email: 'catherine@example.com',
      mobile: '9876543210',
      joindate: '18-04-2013',
      role: 'Web Developer',
      employeeId: 'FT-0001',
      company: 'FT-0001',
      id: 6,
      img: 'assets/img/profiles/avatar-12.jpg',
    },
    {
      firstname: 'Bernardo Galaviz',
      lastname: 'Manseau',
      username: 'Manseau',
      password: '123445',
      confirmpassword: '123456',
      department: 'software',
      designation: 'Web  Developer',
      phone: '9842354254',
      email: 'catherine@example.com',
      mobile: '9876543210',
      joindate: '18-04-2013',
      role: 'Web Developer',
      employeeId: 'FT-0001',
      company: 'FT-0001',
      id: 7,
      img: 'assets/img/profiles/avatar-13.jpg',
    },
    {
      firstname: 'Lesley Grauer',
      lastname: 'Manseau',
      username: 'Manseau',
      password: '123445',
      confirmpassword: '123456',
      department: 'software',
      designation: 'Team Leader',
      phone: '9842354254',
      email: 'catherine@example.com',
      mobile: '9876543210',
      joindate: '18-04-2013',
      role: 'Web Developer',
      employeeId: 'FT-0001',
      company: 'FT-0001',
      id: 8,
      img: 'assets/img/profiles/avatar-16.jpg',
    },
    {
      firstname: 'Jeffery Lalor',
      lastname: 'Manseau',
      username: 'Manseau',
      password: '123445',
      confirmpassword: '123456',
      department: 'software',
      designation: 'Team Leader',
      phone: '9842354254',
      email: 'catherine@example.com',
      mobile: '9876543210',
      joindate: '18-04-2013',
      role: 'Web Developer',
      employeeId: 'FT-0001',
      company: 'FT-0001',
      id: 9,
      img: 'assets/img/profiles/avatar-16.jpg',
    },
    {
      firstname: 'Loren Gatlin',
      lastname: 'Manseau',
      username: 'Manseau',
      password: '123445',
      confirmpassword: '123456',
      department: 'software',
      designation: 'Android Developer',
      phone: '9842354254',
      email: 'catherine@example.com',
      mobile: '9876543210',
      joindate: '18-04-2013',
      role: 'Web Developer',
      employeeId: 'FT-0001',
      company: 'FT-0001',
      id: 10,
      img: 'assets/img/profiles/avatar-04.jpg',
    },
    {
      firstname: 'Tarah Shropshire',
      lastname: 'Manseau',
      username: 'Manseau',
      password: '123445',
      confirmpassword: '123456',
      department: 'software',
      designation: 'Android Developer',
      phone: '9842354254',
      email: 'catherine@example.com',
      mobile: '9876543210',
      joindate: '18-04-2013',
      role: 'Web Developer',
      employeeId: 'FT-0001',
      company: 'FT-0001',
      id: 11,
      img: 'assets/img/profiles/avatar-03.jpg',
    },
    {
      firstname: 'Catherine Manseau',
      lastname: 'Manseau',
      username: 'Manseau',
      password: '123445',
      confirmpassword: '123456',
      department: 'software',
      designation: 'Android Developer',
      phone: '9842354254',
      email: 'catherine@example.com',
      mobile: '9876543210',
      joindate: '18-04-2013',
      role: 'Web Developer',
      employeeId: 'FT-0001',
      company: 'FT-0001',
      id: 12,
      img: 'assets/img/profiles/avatar-08.jpg',
    },
  ];
}
