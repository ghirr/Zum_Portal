import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";
import { AdminDashboardComponent } from "./admin-dashboard/admin-dashboard.component";
import { EmployeeDashboardComponent } from "./employee-dashboard/employee-dashboard.component";
import { AdminTalentGeneralguard } from "src/app/Common/guards/admin-or-talentmanagement-or-general-manager.guard";
import { SimpleOrScrumOrProject } from "src/app/Common/guards/simpe-or-scrum-or-project-manager.guard";

const routes: Routes = [
  {
    path: "",
    component: DashboardComponent,
    children: [
      { path: "admin", component: AdminDashboardComponent ,canActivate:[AdminTalentGeneralguard]},
      { path: "employee", component: EmployeeDashboardComponent,canActivate:[SimpleOrScrumOrProject] },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
