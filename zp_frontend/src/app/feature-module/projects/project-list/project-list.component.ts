import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataService, apiResultFormat, getProjects, routes } from 'src/app/core/core.index';
import { ProjectService } from '../services/project.service';
import { common } from 'src/app/Common/common';
import { AuthService } from '../../authentication/services/auth.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  projects: Array<any> = [];
  public searchDataValue = '';
  dataSource!: MatTableDataSource<getProjects>;
  public routes = routes;
  // pagination variables
  public lastIndex = 0;
  public pageSize = 10;
  public totalData = 0;
  public skip = 0;
  public limit: number = this.pageSize;
  public pageIndex = 0;
  public serialNumberArray: Array<number> = [];
  public currentPage = 1;
  public pageNumberArray: Array<number> = [];
  public pageSelection: Array<pageSelection> = [];
  public totalPages = 0;
  selectedProject: any;
  projectId: any;
  searchProject: any;
  image=common.profileImage

  connectedUser:any;
  //** / pagination variables

  constructor(private authService:AuthService, private service: ProjectService) {}

  ngOnInit(): void {
    this.getTableData();

    // Sorting the projects array based on the status
    this.projects.sort((a, b) => {
      if (a.status === 'Active' && b.status !== 'Active') {
        return -1; // 'a' comes before 'b' since 'a' is active and 'b' is not
      } else if (a.status !== 'Active' && b.status === 'Active') {
        return 1; // 'b' comes before 'a' since 'b' is active and 'a' is not
      } else if (a.status === 'Active' && b.status === 'Active') {
        // If both projects have 'Active' status, sort them alphabetically by name
        return a.name.localeCompare(b.name);
      } else {
        // For all other cases, maintain the order
        return 0;
      }
    });
  }

  // Method to update project status
  updateStatus(id: any, status: string): void {
    // Call the service method to update the project status
    // Pass the project ID and the selected status
    this.service.updateStatus(id, status).subscribe(response => {
        this.getTableData();
    });
}

private getTableData(): void {
  this.projects = [];
  this.serialNumberArray = [];
  this.connectedUser=this.authService.getUser()
  this.service.getAllProjects().subscribe((res: any[]) => {
    const userRole = this.connectedUser.role?.name;
    const userId = this.connectedUser.id;
    
    // Filter projects based on the user's role
    let filteredProjects: any[] = [];
    if (userRole === 'Simple User') {
      filteredProjects = res.filter(project => 
        project.assigned_to.some((user:any) => user.id === userId)
      );
    } else if (userRole === 'Scrum Master') {
      filteredProjects = res.filter(project => 
        project.scrum_master && project.scrum_master.id === userId
      );
    } else if (userRole === 'Project Manager') {
      filteredProjects = res.filter(project => 
        project.project_manager && project.project_manager.id === userId
      );
    } else {
      filteredProjects = res; // Show all projects for other roles
    }

    this.totalData = filteredProjects.length;
    filteredProjects.map((project: any, index: number) => {
      const serialNumber = index + 1;
      if (index >= this.skip && serialNumber <= this.limit) {
        project.Projectid = serialNumber;
        this.projects.push(project);
        this.serialNumberArray.push(serialNumber);
      }
    });

    this.sortProjects();
    this.dataSource = new MatTableDataSource<any>(this.projects);
    this.calculateTotalPages(this.totalData, this.pageSize);
  });
}
private sortProjects(): void {
  // Sorting the projects array based on the status
  this.projects.sort((a, b) => {
    if (a.status === 'Active' && b.status !== 'Active') {
      return -1; // 'a' comes before 'b' since 'a' is active and 'b' is not
    } else if (a.status !== 'Active' && b.status === 'Active') {
      return 1; // 'b' comes before 'a' since 'b' is active and 'a' is not
    } else if (a.status === 'Active' && b.status === 'Active') {
      // If both projects have 'Active' status, sort them alphabetically by name
      return a.name.localeCompare(b.name);
    } else {
      // For all other cases, maintain the order
      return 0;
    }
  });
}

  sortData(event: Sort): void {
    const data = this.projects.slice();
    if (!event.active || event.direction === '') {
      this.projects = data;
      return;
    }
  
    // Define a type for the status values
    type ProjectStatus = 'Active' | 'Suspended' | 'Completed' | 'Paused';
  
    // Define the status order object with explicit types
    const statusOrder: Record<ProjectStatus, number> = {
      Active: 1,
      Suspended: 2,
      Completed: 3,
      Paused: 4
    };
  
    // Use the ProjectStatus type for status properties
    this.projects = data.sort((a: { status: ProjectStatus }, b: { status: ProjectStatus }) => {
      const aValue = statusOrder[a.status];
      const bValue = statusOrder[b.status];
      return (aValue - bValue) * (event.direction === 'asc' ? 1 : -1);
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

  public getMoreData(event: string): void {
    if (event === 'next') {
      this.currentPage++;
      this.pageIndex = this.currentPage - 1;
      this.limit += this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.getTableData();
    } else if (event === 'previous') {
      this.currentPage--;
      this.pageIndex = this.currentPage - 1;
      this.limit -= this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.getTableData();
    }
  }

  public moveToPage(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.skip = this.pageSelection[pageNumber - 1].skip;
    this.limit = this.pageSelection[pageNumber - 1].limit;
    if (pageNumber > this.currentPage) {
      this.pageIndex = pageNumber - 1;
    } else if (pageNumber < this.currentPage) {
      this.pageIndex = pageNumber + 1;
    }
    this.getTableData();
  }

  public changePageSize(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    this.getTableData();
  }

  private calculateTotalPages(totalData: number, pageSize: number): void {
    this.pageNumberArray = [];
    this.totalPages = totalData / pageSize;
    if (this.totalPages % 1 !== 0) {
      this.totalPages = Math.trunc(this.totalPages + 1);
    }
    for (let i = 1; i <= this.totalPages; i++) {
      const limit = pageSize * i;
      const skip = limit - pageSize;
      this.pageNumberArray.push(i);
      this.pageSelection.push({ skip: skip, limit: limit });
    }
  }

  passProjectData(project: any){
    this.selectedProject= project;
  }
  
  handleFormSubmission(){
    this.getTableData();
  }

}
export interface pageSelection {
  skip: number;
  limit: number;
}
interface StatusOrder {
  Active: number;
  Suspended: number;
  Completed: number;
  Paused: number;
}

const statusOrder: StatusOrder = {
  Active: 1,
  Suspended: 2,
  Completed: 3,
  Paused: 4
};
