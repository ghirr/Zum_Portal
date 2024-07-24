import { Component, Input, OnDestroy, OnInit} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DataService, apiResultFormat, getProjects, projectContent, routes } from 'src/app/core/core.index';
import { pageSelection } from '../project-list/project-list.component';
import { Editor, Toolbar, Validators } from 'ngx-editor';
import { ProjectService } from '../services/project.service';
import { common } from 'src/app/Common/common';
import { AuthService } from '../../authentication/services/auth.service';


@Component({
  selector: 'app-project-content',
  templateUrl: './project-content.component.html',
  styleUrls: ['./project-content.component.scss']
})
export class ProjectContentComponent implements OnInit {

  public projects!: Array<any>;
  public routes = routes;
  searchProject: any;
  connectedUser:any;

  
  public projectContent: Array<any> = [];
  public searchDataValue = '';
  dataSource!: MatTableDataSource<any>;

   image=common.profileImage
   selectedProject:any;


  constructor(public router: Router, private authService:AuthService, private service: ProjectService) {
    //this.projects = this.data.projects;
  }
 

   ngOnInit() {
    this.getTableData(); 
  }
   handleFormSubmission(){
    this.getTableData();
   }
   private getTableData(): void {
    this.connectedUser = this.authService.getUser(); 

    this.service.getAllProjects().subscribe((res) => {
      const userId = this.connectedUser.id;
      const userRole = this.connectedUser.role?.name;
  
      let filteredProjects: any[] = [];
    if (userRole === 'Simple User') {
      filteredProjects = res.filter((project:any) => 
        project.assigned_to.some((user:any) => user.id === userId)
      );
    } else if (userRole === 'Scrum Master') {
      filteredProjects = res.filter((project:any) => 
        project.scrum_master && project.scrum_master.id === userId
      );
    } else if (userRole === 'Project Manager') {
      filteredProjects = res.filter((project:any) => 
        project.project_manager && project.project_manager.id === userId
      );
    } else {
      filteredProjects = res; 
    }
  
      this.projects = filteredProjects;
      this.dataSource = new MatTableDataSource<any>(this.projects);
    });
  }


  public searchData(): void {
    const lowerCaseSearchTerm = this.searchProject.trim().toLowerCase();

  
    if (lowerCaseSearchTerm === '') {
      this.projects = this.dataSource.filteredData; // Show all data if search term is empty
    } else {
      this.projects = this.dataSource.filteredData.filter(project => {
        // Filter based on search term in project properties or customer.name
        return Object.values(project).some(value => {
          return value !== null && value?.toString().toLowerCase().includes(lowerCaseSearchTerm);
        }) ||
          project.customer && // Check if customer exists
          project.customer.name.toString().toLowerCase().includes(lowerCaseSearchTerm);
      });
    }
  }

}
