import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService, getEmployees, lstEmployee, routes } from 'src/app/core/core.index';
import { UserService } from '../../services/user.service';
import { MatTableDataSource } from '@angular/material/table';
import { common } from 'src/app/Common/common';
import { AuthService } from 'src/app/feature-module/authentication/services/auth.service';

@Component({
  selector: 'app-employee-page-content',
  templateUrl: './employee-page-content.component.html',
  styleUrls: ['./employee-page-content.component.scss'],
})
export class EmployeePageContentComponent implements OnInit{
  public routes = routes;
  selected = 'option1';
  public dataSource: MatTableDataSource<getEmployees> = new MatTableDataSource<getEmployees>();
  public skip = 0;
  public lstEmployee: Array<any>= [];
  selectedUser:any;
  public searchUser: string = '';
  filteredEmployees: Array<any> = [];
  users: Array<any> = [];
  employeeId: any;
  image=common.profileImage;
  permissions:any=[];

  constructor(public router: Router, private service : UserService,private authService:AuthService) {
  }
  ngOnInit(): void {
    this.getTableData();
    this.permissions=this.authService.getUser().permissions;
  }
  handleFormSubmission(){
    this.getTableData();
  }
  private getTableData(): void {

    this.service.getUsersGrid().subscribe((res) => {
      this.users=res;
      this.lstEmployee=res;
    });

 
  }
  
  passUserData(user: any){
    this.selectedUser= user;
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
    this.lstEmployee = filtered;
}
}
