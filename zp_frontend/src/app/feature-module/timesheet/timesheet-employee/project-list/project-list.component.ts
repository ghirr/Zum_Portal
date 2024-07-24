import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataService, getProjects, routes } from 'src/app/core/core.index';
import { TimesheetService } from '../../services/timesheet.service';
import { AuthService } from 'src/app/feature-module/authentication/services/auth.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent {
  projects: Array<any> = [];
  public searchDataValue = '';
  dataSource!: MatTableDataSource<any>;
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
  searchProject:any;
  //** / pagination variables

  constructor(private service: TimesheetService,private authService:AuthService) {}

  ngOnInit(): void {
    this.getTableData();
  }


  private getTableData(): void {
    this.projects = [];
    this.serialNumberArray = [];

    this.service.getProjectsByEmpoyeeId(this.authService.getUser().id).subscribe((res) => {
      
      this.totalData = res.length;
      res.map((res: any, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          res.Projectid = serialNumber;
          this.projects.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
      this.dataSource = new MatTableDataSource<getProjects>(this.projects);
      this.calculateTotalPages(this.totalData, this.pageSize);
    });

 
  }

  public sortData(sort: Sort) {
    const data = this.projects.slice();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (!sort.active || sort.direction === '') {
      this.projects = data;
    } else {
      this.projects = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
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

}
export interface pageSelection {
  skip: number;
  limit: number;
}
