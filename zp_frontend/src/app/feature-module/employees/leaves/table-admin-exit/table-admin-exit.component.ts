import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { routes } from 'src/app/core/core.index';
import { Sort } from '@angular/material/sort';
import { ExitAuthorizationService } from '../../services/exit-authorization.service';
import { FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ModalService } from 'src/app/Common/commonservices/modal.service';
import { environment } from 'src/app/ENVIRONMENTS/environment';
import { common } from 'src/app/Common/common';
import { ToasterService } from 'src/app/core/services/toaster/toaster.service';

@Component({
  selector: 'app-table-admin-exit',
  templateUrl: './table-admin-exit.component.html',
  styleUrls: ['./table-admin-exit.component.scss']
})
export class TableAdminExitComponent implements OnInit {
  
  public  statusValue!: string;
  public lstLeave: Array<any> = [];
 
  dataSource!: MatTableDataSource<any>;
  public routes = routes;

  alldata: Array<any> = [];

  editExitRequest:any;
  exittoedit:any;
  remainExit:number=0;
  showTimePicker: Array<string> = [];
  today = new Date;
  zones: Date = new Date();
  setTime: Date = new Date();
  minTime: Date= new Date();
  maxTime: Date= new Date();
  maxStartTime: Date= new Date();
  isSubmited=false;

  baseUrl=environment.apiUrl
  image=common.profileImage
  process:any=[];  
  progressValue:any;
  

  // pagination variables
  public lastIndex = 0;
  public pageSize = 5;
  public totalData = 0;
  public skip = 0;
  public limit: number = this.pageSize;
  public pageIndex = 0;
  public serialNumberArray: Array<number> = [];
  public currentPage = 1;
  public pageNumberArray: Array<number> = [];
  public pageSelection: Array<pageSelection> = [];
  public totalPages = 0;
  //** / pagination variables
  @Output() formSubmitted = new EventEmitter();

  constructor(private exitService:ExitAuthorizationService, private formBuilder: FormBuilder,
    private model :ModalService,private datePipe: DatePipe,private toaster :ToasterService) {
    }

    get z() { return this.editExitRequest.controls}
    ngOnInit(): void {
    this.getTableData();

    this.setMinTime();
    this.setMaxTime();
    this.setMaxStartTime();

    this.editExitRequest = this.formBuilder.group({
      exit_day: ['', Validators.required],
      hours: [0, [Validators.required,Validators.min(1)]],
      reason: ['', Validators.required],
    })
    }
    ngOnChange(){
    if(this.exittoedit){
    this.editExitRequest.patchValue({
    exit_day: new Date(this.exittoedit.exit_day),
    hours: this.exittoedit.number_of_hours,
    reason: this.exittoedit.Reason,
    })

    let start= this.exittoedit.exit_start.split(':');
    let end= this.exittoedit.exit_end.split(':');

    this.zones.setHours(Number(start[0]),Number(start[1]))
    this.setTime.setHours(Number(end[0]),Number(end[1]))
    this.remainExit=this.exittoedit.user.exitamount
    

    }
    }

  private getTableData(): void {
    this.lstLeave = [];
    this.serialNumberArray = [];

    this.exitService.getAdminExit().subscribe((res: any) => {
      this.totalData = res.length;
      this.alldata=res;
      res.map((res: any, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          res.ttId = serialNumber;
          this.lstLeave.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
      this.dataSource = new MatTableDataSource<any>(this.lstLeave);
      this.calculateTotalPages(this.totalData, this.pageSize);
    });

 
  }

  filterExit(employeeId: any) {
    this.lstLeave = [];
  
    let filter = this.alldata.filter((TT: any) => {
      return TT.user.id == employeeId;
    });
  
    this.totalData = filter.length;
    filter.map((res: any, index: number) => {
      const serialNumber = index + 1;
      if (index >= this.skip && serialNumber <= this.limit) {
        res.ttId = serialNumber;
        this.lstLeave.push(res);
        this.serialNumberArray.push(serialNumber);
      }
    });
    this.dataSource = new MatTableDataSource<any>(this.lstLeave);
    this.calculateTotalPages(this.totalData, this.pageSize);
  }

  public sortData(sort: Sort) {
    const data = this.lstLeave.slice();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (!sort.active || sort.direction === '') {
      this.lstLeave = data;
    } else {
      this.lstLeave = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
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
  
  //getting the status value
  getStatus(data: any) {
    this.statusValue = data;
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

  toggleTimePcker(value: string): void {
    if (this.showTimePicker[0] !== value) {
      this.showTimePicker[0] = value;
    } else {
      this.showTimePicker = [];
    }
  }
  formatTime(date: any): any {
    const selectedDate: Date = new Date(date);
    return this.datePipe.transform(selectedDate, 'h:mm a');
  }
  formatTimeSubmit(date: any): any {
    const selectedDate: Date = new Date(date);
    return this.datePipe.transform(selectedDate, 'HH:mm:00');
  }
  setMinTime() {
    this.minTime.setHours(8, 0, 0, 0);
  }
  setMaxTime() {
    this.maxTime.setHours(17, 1, 0, 0);
  }
  setMaxStartTime() {
    this.maxStartTime.setHours(16, 0, 0, 0);
  }
  addOneHour() {
    const newTime = new Date(this.zones);
    newTime.setHours(newTime.getHours() + 1);
    this.setTime = newTime;
  }
  calculateTimeDifference(): any {
    // Convert both times to milliseconds since midnight
    const startMilliseconds = this.zones.getHours() * 3600000 + this.zones.getMinutes() * 60000;
    const endMilliseconds = this.setTime.getHours() * 3600000 + this.setTime.getMinutes() * 60000;

    // Calculate the difference in milliseconds
    let difference = endMilliseconds - startMilliseconds;

    // If the end time is before the start time, adjust for wrapping around midnight
    if (difference < 0) {
        difference += 24 * 3600000; // 24 hours in milliseconds
    }


  // Return the formatted difference
  return difference/3600000;
  }
  editExitReaquest(){
    this.isSubmited=true;
    if(this.editExitRequest.valid ){
    
    
    let exitDay=this.model.formatDate(this.editExitRequest.value.exit_day);
      
    const formData = new FormData()
    formData.append('exit_day', exitDay)
    formData.append('exit_start', this.formatTimeSubmit(this.zones))
    formData.append('exit_end', this.formatTimeSubmit(this.setTime))
    formData.append('number_of_hours', this.editExitRequest.value.hours)
    formData.append('Reason', this.editExitRequest.value.reason)

     this.exitService.editExitRequest(formData,this.exittoedit.id).subscribe(
      (res)=>{
        this.getTableData();
        this.toaster.typeSuccess("Exit Permission Edited","Success")
       this.model.closeModel('edit_admin_exit');
       
     },
      (error)=>{
       this.model.closeModel('edit_admin_exit');
      })
    }
  }
  deleteExitReqest(){
    this.exitService.deleteExitRequest(this.exittoedit?.id).subscribe((res)=>{
      this.getTableData();
      this.formSubmitted.emit()
      this.toaster.typeSuccess("Exit Permission Deleted","Success")
      this.model.closeModel('delete_admin_exit');
    },
  (error)=>{
    this.model.closeModel('delete_admin_exit');
  })
  }

  openProcess(process:any){
    this.process=process
    const totalApprovers = this.process.length;
    const approvedOrDeclined = this.process.filter(
      (approver:any) => approver.approved === 'Approved' || approver.approved === 'Declined'
    ).length;
    this.progressValue = (approvedOrDeclined / totalApprovers) * 100;
  }

  getProgressBarColor(): string {
    if (this.process.some((approver:any) => approver.approved === 'Declined')) {
      return 'warn'; // Red color for declined
    } else if (this.process.every((approver:any) => approver.approved === 'Approved')) {
      return 'primary'; 
    } else {
      return 'accent'; // Blue color for pending
    }
  }
}
export interface pageSelection {
  skip: number;
  limit: number;

  
}