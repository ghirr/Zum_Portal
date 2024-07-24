import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataService, apiResultFormat, getLeave, routes } from 'src/app/core/core.index';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalService } from 'src/app/Common/commonservices/modal.service';
import { UserService } from '../../services/user.service';
import { TtService } from '../../services/tt.service';
import { DatePipe } from '@angular/common';
import { ExitAuthorizationService } from '../../services/exit-authorization.service';
import { TableTTComponent } from '../table-tt/table-tt.component';
import { TableLeaveComponent } from '../table-leave/table-leave.component';
import { TableExitauthorizationComponent } from '../table-exitauthorization/table-exitauthorization.component';
import { LeaveService } from '../../services/leave.service';
import { ToasterService } from 'src/app/core/services/toaster/toaster.service';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-leaves-employee',
  templateUrl: './leaves-employee.component.html',
  styleUrls: ['./leaves-employee.component.scss']
})
export class LeavesEmployeeComponent implements OnInit {
  public lstLeave: Array<any> = [];
  public lstLeaveType: Array<any> = [];
  selectedType:any;
  addLeaveRequest:any;
  addExitRequest:any;
  firstFormGroup:any;
  addTTRequest:any;
  today = new Date;
  remainLeaves:number=0;
  remainTT:number=0;
  remainExit:number=0;
  isExitSubmited=false;
  isLeaveSubmited=false;
  isTTSubmited=false;
  showTimePicker: Array<string> = [];
  zones: Date = new Date();
  setTime: Date = new Date();
  minTime: Date= new Date();
  maxTime: Date= new Date();
  maxStartTime: Date= new Date();

  public leavesType: any;
  @ViewChild(TableLeaveComponent) leaveTable!: TableLeaveComponent;
  @ViewChild(TableTTComponent) ttTable!: TableTTComponent;
  @ViewChild(TableExitauthorizationComponent) exitTable!: TableExitauthorizationComponent;
  @ViewChild('stepper') stepper!: MatStepper;
  public routes = routes;

  constructor(private leaveService:LeaveService, private formBuilder: FormBuilder,
              private model :ModalService , private ttService:TtService,private toaste:ToasterService,
              private exitService:ExitAuthorizationService ,private datePipe: DatePipe) {
                this.setTime.setHours(this.setTime.getHours()+1)
                this.setMinTime();
                this.setMaxTime();
                this.setMaxStartTime();
                this.setFormTime();
              }
              get f() { return this.addLeaveRequest.controls}
              get g() { return this.addTTRequest.controls}
              get z() { return this.addExitRequest.controls}
  ngOnInit(): void {
    this.getReamainingLeaves()
    this.getLeavesType()
    this.leavesType= [
      [['Leave', this.addLeaveRequest]],
      [['working remotely', this.addTTRequest]],
      [['exit authorization', this.addExitRequest]]
  ];
    this.selectedType=this.leavesType[0]
    this.firstFormGroup = this.formBuilder.group({
      type:['', Validators.required],    });

      /*              Leaves  Form                  */
    this.addLeaveRequest = this.formBuilder.group({
      type:['', Validators.required],
      leave_start: ['', Validators.required],
      leave_end: ['', Validators.required],
      days: [0, [Validators.required,Validators.min(1)]],
      reason: ['', Validators.required],
    })
    /*              Leaves  Form                  */

    /*              TT  Form                  */

    this.addTTRequest = this.formBuilder.group({
      tt_start: ['', Validators.required],
      tt_end: ['', Validators.required],
      days: [0, [Validators.required,Validators.min(1)]],
    })

    /*              TT  Form                  */
    this.addExitRequest = this.formBuilder.group({
      exit_day: ['', Validators.required],
      hours: [1, [Validators.required,Validators.min(1)]],
      reason: ['', Validators.required],
    })
    }
  getReamainingLeaves(){
    this.leaveService.getRemainingLeaves().subscribe((res:any)=>{
      this.remainLeaves=res.remaining_leaves;
      this.remainTT=res.remaining_TT;
      this.remainExit=res.remaining_exit
    })
  }
/*            Leaves                               */
  getLeavesType(){
    this.leaveService.getLeavesTypes().subscribe((res:any)=>{
      this.lstLeaveType=res;
      this.addLeaveRequest.patchValue({type: this.lstLeaveType[0]})

    })
  }
  getMinDate(): Date {
    let formtype=this.addLeaveRequest; 

    const startDate = formtype.get('leave_start').value ;
    const minDate = new Date(startDate);
    let daysToAdd = formtype.get('type').value.minDays-1 // Number of days to add
    while (daysToAdd > 0) {
      minDate.setDate(minDate.getDate() + 1); // Increment date by 1 day
      
      // Check if the current day is not Saturday (6) or Sunday (0)
      if (minDate.getDay() !== 0 && minDate.getDay() !== 6) {
        daysToAdd--; // Decrease the count of days to add
      }
    }
    return startDate ? new Date(minDate) : this.today;
  }
  getMaxDate(): Date {
    let formtype=this.addLeaveRequest; 

    const startDate = formtype.get('leave_start').value;
    
    if (!startDate) {
      return this.today; // Return null if start date is not selected
    }
  
    const minDate = new Date(startDate);
    let daysToAdd = formtype.get('type').value.maxDays<this.remainLeaves?formtype.get('type').value.maxDays-1:this.remainLeaves-1 // Number of days to add
   
    while (daysToAdd > 0) {
      minDate.setDate(minDate.getDate() + 1); // Increment date by 1 day
      
      // Check if the current day is not Saturday (6) or Sunday (0)
      if (minDate.getDay() !== 0 && minDate.getDay() !== 6) {
        daysToAdd--; // Decrease the count of days to add
      }
    }
  
    return minDate;
  }
  calculateNumberOfDaysLeave(): number {
    let formtype=this.addLeaveRequest;

    const startDate = formtype.get('leave_start').value;
    const endDate = formtype.get('leave_end').value;
    if (!startDate || !endDate) {
      return 0; // Return 0 if either start date or end date is not selected
    }
  
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    // Calculate the difference in milliseconds
    const timeDifference = end.getTime() - start.getTime();
  
    // Convert the difference to days
    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
  
    // Exclude weekends from the count
    let numberOfDays = daysDifference+1;
    let currentDate = new Date(start);
  
    while (currentDate <= end) {
      // Check if the current day is Saturday (6) or Sunday (0)
      if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
        numberOfDays--; // Decrease the count if it's a weekend
      }
      
      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
    formtype.patchValue({days:numberOfDays})
    return numberOfDays;
  }
  resetForm() {
    this.addLeaveRequest.patchValue({
      type: this.lstLeaveType[0],
      leave_start: '',
      leave_end: '',
      days: 0,
      reason: ''
    })
    this.addTTRequest.patchValue({
      leave_start: '',
      leave_end: '',
      days: 0,
      reason: ''
    })
    this.addExitRequest.patchValue({
      exit_day: '',
      hours: 0,
      reason: ''
    })
    this.isExitSubmited=false;
    this.isLeaveSubmited=false;
    this.isTTSubmited=false;
    this.stepper.reset();
  }
  addLeaveReaquest(){
    this.isLeaveSubmited=true;
    
    if(!this.addLeaveRequest.valid ||this.remainLeaves<this.addLeaveRequest.value.days){
      return
    }
    
    let startDate=this.model.formatDate(this.addLeaveRequest.value.leave_start);
    let endDate=this.model.formatDate(this.addLeaveRequest.value.leave_end);

    const formData = new FormData()
    formData.append('type', this.addLeaveRequest.value.type.id)
    formData.append('leave_start', startDate)
    formData.append('leave_end', endDate)
    formData.append('number_of_days', this.addLeaveRequest.value.days)
    formData.append('Reason', this.addLeaveRequest.value.reason)
    this.leaveService.addLeaveRequest(formData).subscribe(
      (res)=>{
        this.leaveTable.handleFormSubmission()
        this.toaste.typeSuccess("Leave Request Passed","Sucess")
        this.model.closeModel('add_leaves');
        this.resetForm();
    },
      (error)=>{
        this.model.closeModel('add_leaves');
      })
  }

/*            Leaves                               */
  /*            TT                               */
  getMinDateTT(): Date {
    let formtype=this.addTTRequest; 

    const startDate = formtype.get('tt_start').value ;
    const minDate = new Date(startDate);
    return startDate ? new Date(minDate) : this.today;
  }
  getMaxDateTT(): Date {
    let formtype=this.addTTRequest; 

    const startDate = formtype.get('tt_start').value;
    
    if (!startDate) {
      return this.today; // Return null if start date is not selected
    }
  
    const minDate = new Date(startDate);
    let daysToAdd =this.remainTT-1 // Number of days to add
   
    while (daysToAdd > 0) {
      minDate.setDate(minDate.getDate() + 1); // Increment date by 1 day
      
      // Check if the current day is not Saturday (6) or Sunday (0)
      if (minDate.getDay() !== 0 && minDate.getDay() !== 6) {
        daysToAdd--; // Decrease the count of days to add
      }
    }
  
    return minDate;
  }
  calculateNumberOfDaysTT(): number {
    let formtype=this.addTTRequest; 

    const startDate = formtype.get('tt_start').value;
    const endDate = formtype.get('tt_end').value;
    
    if (!startDate || !endDate) {
      return 0; // Return 0 if either start date or end date is not selected
    }
  
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    // Calculate the difference in milliseconds
    const timeDifference = end.getTime() - start.getTime();
  
    // Convert the difference to days
    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
  
    // Exclude weekends from the count
    let numberOfDays = daysDifference+1;
    let currentDate = new Date(start);
  
    while (currentDate <= end) {
      // Check if the current day is Saturday (6) or Sunday (0)
      if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
        numberOfDays--; // Decrease the count if it's a weekend
      }
      
      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
    formtype.patchValue({days:numberOfDays})
    return numberOfDays;
  }
  addTTReaquest(){
    this.isTTSubmited=true;
    if(!this.addTTRequest.valid ){
      return
    }
    
    let startDate=this.model.formatDate(this.addTTRequest.value.tt_start);
    let endDate=this.model.formatDate(this.addTTRequest.value.tt_end);

    const formData = new FormData()
    formData.append('tt_start', startDate)
    formData.append('tt_end', endDate)
    formData.append('number_of_days', this.addTTRequest.value.days)
    this.ttService.addTTRequest(formData).subscribe(
      (res)=>{
       this.ttTable.handleFormSubmission()
       this.toaste.typeSuccess("TT Request Passed","Sucess")
       this.model.closeModel('add_leaves');
       this.resetForm();
    },
     (error)=>{
        this.model.closeModel('add_leaves');
      })
  }

    /*            TT                               */

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
      this.maxStartTime.setHours(16, 1, 0, 0);
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
  
  
      this.addExitRequest.patchValue({
        hours:difference/3600000
      })
    // Return the formatted difference
    return difference/3600000;
    }
    addExitReaquest(){
      this.isExitSubmited=true;
      if(this.addExitRequest.valid && this.addExitRequest.value.hours<=this.remainExit){
      
      let exitDay=this.model.formatDate(this.addExitRequest.value.exit_day);
      
      const formData = new FormData()
      formData.append('exit_day', exitDay)
      formData.append('exit_start', this.formatTimeSubmit(this.zones))
      formData.append('exit_end', this.formatTimeSubmit(this.setTime))
      formData.append('number_of_hours', this.addExitRequest.value.hours)
      formData.append('Reason', this.addExitRequest.value.reason)
      
      
      this.exitService.addExitRequest(formData).subscribe(
        (res)=>{
          this.exitTable.handleFormSubmission()
          this.toaste.typeSuccess("Exit Permission Request Passed","Sucess")
         this.model.closeModel('add_leaves');
         this.resetForm();
      },
       (error)=>{
          this.model.closeModel('add_leaves');
        })
      }
    }
    setFormTime(){
      this.zones.setHours(15, 0, 0, 0);
      this.setTime.setHours(17, 0, 0, 0);
    }

    selectType(type:any) {
      this.resetForm()
      this.selectedType=type;
    }

}
export interface pageSelection {
  skip: number;
  limit: number;
}