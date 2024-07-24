import { Component, OnInit, ViewChild } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../services/user.service';
import { routes } from 'src/app/core/helpers/routes/routes';
import { common } from 'src/app/Common/common';
import { TableAdminLeaveComponent } from '../table-admin-leave/table-admin-leave.component';
import { TableAdminTTComponent } from '../table-admin-tt/table-admin-tt.component';
import { TableAdminExitComponent } from '../table-admin-exit/table-admin-exit.component';
import { LeaveService } from '../../services/leave.service';

@Component({
  selector: 'app-leaves-admin',
  templateUrl: './leaves-admin.component.html',
  styleUrls: ['./leaves-admin.component.scss']
})
export class LeavesAdminComponent implements OnInit {

 
  public routes = routes;
  
  
  employees: any[] = [];
  selectedEmployee: any;
  image=common.profileImage
  presents:any=0;
  planned:any=0;
  unplanned:any=0;
  requestes:any=0;

  @ViewChild(TableAdminLeaveComponent) leaveTable!: TableAdminLeaveComponent;
  @ViewChild(TableAdminTTComponent) ttTable!: TableAdminTTComponent;
  @ViewChild(TableAdminExitComponent) exitTable!: TableAdminExitComponent;
 

  constructor(private userService:UserService,private leaveService:LeaveService) {}

  ngOnInit(): void {
    this.getEmployees();
    this.getHeader();
  }

  selectetedEmploye(){
    this.ttTable.filterTT(this.selectedEmployee);
    this.exitTable.filterExit(this.selectedEmployee);
    this.leaveTable.filterLeave(this.selectedEmployee);
  }
  handleFormSubmission() {
    this.getHeader()
  }

  getEmployees(){
    this.userService.getUsersGrid().subscribe((res)=>{
      this.employees=res;
    })
  }

  getHeader(){
    this.leaveService.getAdminHeader().subscribe((res:any)=>{
      this.presents=res.presents;
      this.planned=res.planned;
      this.unplanned=res.unplanned;
      this.requestes=res.pending
    })
  }

  
}
export interface pageSelection {
  skip: number;
  limit: number;

  
}




