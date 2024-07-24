import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectContentComponent } from './project-content/project-content.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectViewComponent } from './project-view/project-view.component';
import { ProjectsComponent } from './projects.component';
import { TaskBoardComponent } from './task-board/task-board.component';
import { TasksComponent } from './tasks/tasks.component';
import { AdminTalentGeneralguard } from 'src/app/Common/guards/admin-or-talentmanagement-or-general-manager.guard';
import { AdminTalentGeneralProjectguard } from 'src/app/Common/guards/admin-or-talentmanagement-or-general-manager-or-project-manager.guard.spec';

const routes: Routes = [
  { 
    path: '', 
    component: ProjectsComponent,
    children: [
      { path: "project-page", component: ProjectContentComponent },
      { path: "project-list", component: ProjectListComponent },
      { path: "project-view/:id", component: ProjectViewComponent },
      { path: "task-board/:id", component: TaskBoardComponent },
      { path: "tasks", component: TasksComponent },
    ]
   }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }
