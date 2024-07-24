import { Component, Input, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { getLeave, routes } from 'src/app/core/core.index';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalService } from 'src/app/Common/commonservices/modal.service';
import { TtService } from '../../services/tt.service';
import { environment } from 'src/app/ENVIRONMENTS/environment';
import { common } from 'src/app/Common/common';
import { ToasterService } from 'src/app/core/services/toaster/toaster.service';

@Component({
  selector: 'app-table-tt',
  templateUrl: './table-tt.component.html',
  styleUrls: ['./table-tt.component.scss']
})
export class TableTTComponent implements OnInit {
  public lstTT: Array<any> = [];
  public lstTTType: Array<any> = [];  
  editTTRequest:any;
  ttToEdit:any;
  today = new Date;
  @Input() remainTT:number=0;
  isSubmited=false;

  baseUrl=environment.apiUrl
  image=common.profileImage
  process:any=[];  
  progressValue:any;


  dataSource!: MatTableDataSource<getLeave>;
  public routes = routes;
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

  constructor(private ttService:TtService, private formBuilder: FormBuilder,private toaste:ToasterService,
              private model :ModalService) {}

              get g() { return this.editTTRequest.controls}
  ngOnInit(): void {
    this.getTableData();

    this.editTTRequest = this.formBuilder.group({
      tt_start: ['', Validators.required],
      tt_end: ['', Validators.required],
      days: [0, [Validators.required,Validators.min(1)]],
    })
  }
  ngOnChange(){
    if(this.ttToEdit){
      const matchingLeaveType = this.lstTTType.find(type => type.name === this.ttToEdit.type.name);
      this.editTTRequest.patchValue({
        tt_start: new Date(this.ttToEdit.tt_start),
        tt_end: new Date(this.ttToEdit.tt_end),
        days: this.ttToEdit.number_of_days,
        reason: this.ttToEdit.Reason,
      })
    }
    
  }
  handleFormSubmission() {
    this.getTableData();
  }
  private getTableData(): void {
    this.lstTT = [];
    this.serialNumberArray = [];

    this.ttService.getTTLeaves().subscribe((res: any) => {
      this.totalData = res.length;
      res.map((res: any, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          res.ttid = serialNumber;
          this.lstTT.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
      this.dataSource = new MatTableDataSource<any>(this.lstTT);
      this.calculateTotalPages(this.totalData, this.pageSize);
    });

 
  }

  public sortData(sort: Sort) {
    const data = this.lstTT.slice();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (!sort.active || sort.direction === '') {
      this.lstTT = data;
    } else {
      this.lstTT = data.sort((a: any, b: any) => {
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
  getMinDate(): Date {
    const startDate = this.editTTRequest.get('tt_start').value;
    return startDate ? new Date(startDate) : this.today;
  }
  
  getMaxDate(): Date {
    const startDate = this.editTTRequest.get('tt_start').value;
  
    const minDate = new Date(startDate);
    let daysToAdd = this.remainTT - 1;
  
    while (daysToAdd > 0) {
      minDate.setDate(minDate.getDate() + 1);
      if (minDate.getDay() !== 0 && minDate.getDay() !== 6) {
        daysToAdd--;
      }
    }
  
    return minDate;
  }
  
  calculateNumberOfDays(): number {
    let formtype=this.editTTRequest;
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
  editTTReaquest(){
    this.isSubmited=true;
    if(this.editTTRequest.valid ){
    let startDate=this.model.formatDate(this.editTTRequest.value.tt_start)
    let endDate=this.model.formatDate(this.editTTRequest.value.tt_end)

    const formData = new FormData()
    formData.append('tt_start', startDate)
    formData.append('tt_end', endDate)
    formData.append('number_of_days', this.editTTRequest.value.days)
     this.ttService.editTTRequest(formData,this.ttToEdit.id).subscribe(
      (res)=>{
        this.getTableData()
        this.toaste.typeSuccess("TT Edited","Sucess")
       this.model.closeModel('edit_tt');
       
     },
      (error)=>{
        this.model.closeModel('edit_tt');
      })
    }
  }
  deleteTTReqest(){
    this.ttService.deleteTTRequest(this.ttToEdit.id).subscribe((res)=>{
      this.getTableData();
      this.toaste.typeSuccess("TT Deleted","Sucess")
      this.model.closeModel('delete_tt');
    },
  (error)=>{
    this.model.closeModel('delete_tt');
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