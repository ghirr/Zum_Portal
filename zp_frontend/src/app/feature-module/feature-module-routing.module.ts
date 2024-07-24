import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeatureModuleComponent } from './feature-module.component';
import { RolesAndPermisionsComponent } from './roles-and-permisions/roles-and-permisions.component';
import { MeetingRoomsComponent } from './meeting-rooms/meeting-rooms.component';
import { AuthServiceGuard } from '../Common/guards/auth.service';
import { AdminTalentGeneralguard } from '../Common/guards/admin-or-talentmanagement-or-general-manager.guard';
import { roleGuard } from '../Common/guards/role.guard';
import { Error404Component } from './auth/error404/error404.component';
import { errorGuard } from '../Common/guards/error.guard';
const routes: Routes = [
  {
    path: '',
    canActivate: [roleGuard],
    children: []
  },
  {
    path: '',
    component: FeatureModuleComponent,
    children: [
      {
        path: 'dashboard',
        canActivate: [AuthServiceGuard],
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'apps',
        loadChildren: () =>
          import('./apps/apps.module').then((m) => m.AppsModule),
      },
      {
        path: 'employees',
        canActivate: [AuthServiceGuard],
        loadChildren: () =>
          import('./employees/employees.module').then((m) => m.EmployeesModule),
      },
      {
        path: 'customers',
        canActivate: [AuthServiceGuard],
        loadChildren: () =>
          import('./customer/customer.module').then((m) => m.CustomerModule),
      },
      
      {
        path: 'timesheet',
        canActivate: [AuthServiceGuard],
        loadChildren: () =>
          import('./timesheet/timesheet.module').then((m) => m.TimesheetModule),
      },
      
      {
        path: 'projects',
        canActivate: [AuthServiceGuard],
        loadChildren: () =>
          import('./projects/projects.module').then((m) => m.ProjectsModule),
      },
      {
        path: 'settings/roles_permissions',
        component:RolesAndPermisionsComponent,
        canActivate:[AuthServiceGuard,AdminTalentGeneralguard]
      },
      {
        path: 'settings/meeting_rooms',
        component:MeetingRoomsComponent,
        canActivate:[AuthServiceGuard,AdminTalentGeneralguard]
      },
    ],
  },
  
  {
    path: 'authentication',
    //canActivate: [AuthServiceGuard],
    loadChildren: () =>
      import('./authentication/authentication.module').then((m) => m.AuthenticationModule),
  },
  {
    path: '404',
    loadChildren: () =>
      import('./auth/error404/error404.module').then((m) => m.Error404Module),
  },
  {
    path: '500',
    loadChildren: () =>
      import('./auth/error500/error500.module').then((m) => m.Error500Module),
  },
  { path: '**' ,loadChildren: () =>
    import('./auth/error404/error404.module').then((m) => m.Error404Module), }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeatureModuleRoutingModule {}
