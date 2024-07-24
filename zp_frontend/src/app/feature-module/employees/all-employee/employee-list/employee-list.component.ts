import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { routes } from 'src/app/core/core.index';
import { UserService } from '../../services/user.service';
import { common } from 'src/app/Common/common';
import { AuthService } from 'src/app/feature-module/authentication/services/auth.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
})
export class EmployeeListComponent implements OnInit {
  public lstEmployee: Array<any> = [];
  public searchDataValue = '';
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
  selectedUser:any;
  searchUser: string='';
  filteredEmployees: Array<any> = [];
  users: Array<any> = [];
  employeeId:any;
  image=common.profileImage
  //** / pagination variables
  permissions:any=[];

  constructor(private service : UserService,private authService:AuthService) {}

  ngOnInit(): void {
    this.getTableData();
    this.permissions=this.authService.getUser().permissions;
  }

  private getTableData(): void {
    this.lstEmployee = [];
    this.serialNumberArray = [];

    this.service.getUsers().subscribe((res) => {
      this.users=res;
      this.totalData = res.length;
      
      res.map((res: any, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          res.userid = serialNumber;
          this.lstEmployee.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
         this.calculateTotalPages(this.totalData, this.pageSize);
    });

 
  }

  handleFormSubmission(){
    this.getTableData();
  }
  public sortData(sort: Sort) {
    const data = this.lstEmployee.slice();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (!sort.active || sort.direction === '') {
      this.lstEmployee = data;
    } else {
      this.lstEmployee = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public searchData(event: KeyboardEvent): void {
    const target = event.target as HTMLInputElement;
    let filtered;
    if (target.value.trim() !== '') {
        filtered = this.users.filter(user => {
            for (const key in user) {
                if (typeof user[key] === 'string' && user[key].toLowerCase().includes(target.value.toLowerCase())) {
                    return true;
                }
            }
            return false;
        });
    } else {
        filtered = this.users;
    }
    this.totalData = filtered.length;
    this.lstEmployee = filtered;
    this.calculateTotalPages(this.totalData, this.pageSize);
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

  passUserData(user: any){
    this.selectedUser= user;
  }
  getEmployeeDetails(id: any): void {
    if (id) {
        this.service.getUserById(id)
            .subscribe((employeeDetails) => {
                this.selectedUser = employeeDetails; 
            });
    }
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
