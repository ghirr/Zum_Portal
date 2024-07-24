import { Component, Input, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { getLeave, routes } from 'src/app/core/core.index';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalService } from 'src/app/Common/commonservices/modal.service';
import { LeaveService } from '../../services/leave.service';
import { environment } from 'src/app/ENVIRONMENTS/environment';
import { common } from 'src/app/Common/common';
import { ToasterService } from 'src/app/core/services/toaster/toaster.service';
@Component({
  selector: 'app-table-leave',
  templateUrl: './table-leave.component.html',
  styleUrls: ['./table-leave.component.scss']
})
export class TableLeaveComponent implements OnInit {
  public lstLeave: Array<any> = [];
  public lstLeaveType: Array<any> = [];
  editLeaveRequest: any;
  leaveToEdit: any;
  today = new Date;

  baseUrl = environment.apiUrl
  image = common.profileImage
  process: any = [];
  progressValue: any;

  @Input() remainLeaves: number = 0;
  isSubmited = false;

  public leavesType: any;
  public searchDataValue = '';
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

  constructor(private leaveService: LeaveService, private formBuilder: FormBuilder,private toaste:ToasterService,
    private model: ModalService) { }

  get f() { return this.editLeaveRequest.controls }


  ngOnInit(): void {
    this.getLeavesType()
    this.getTableData();

    this.editLeaveRequest = this.formBuilder.group({
      type: ['', Validators.required],
      leave_start: ['', Validators.required],
      leave_end: ['', Validators.required],
      days: [0, [Validators.required,Validators.min(1)]],
      reason: ['', Validators.required],
    });

    /*              Leaves  Form                  */

  }
  ngOnChange() {
      const matchingLeaveType = this.lstLeaveType.find(type => type.name === this.leaveToEdit.type.name);
      this.editLeaveRequest.patchValue({
        type: matchingLeaveType,
        leave_start: new Date(this.leaveToEdit.leave_start),
        leave_end: new Date(this.leaveToEdit.leave_end),
        days: this.leaveToEdit.number_of_days,
        reason: this.leaveToEdit.Reason,
      });
      
  }
  handleFormSubmission() {
    this.getTableData();
  }
  private getTableData(): void {
    this.lstLeave = [];
    this.serialNumberArray = [];

    this.leaveService.getEmployeeLeaves().subscribe((res: any) => {
      this.totalData = res.length;
      res.map((res: any, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          res.Leaveid = serialNumber;
          this.lstLeave.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
      this.dataSource = new MatTableDataSource<any>(this.lstLeave);
      this.calculateTotalPages(this.totalData, this.pageSize);
    });


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

  getLeavesType() {
    this.leaveService.getLeavesTypes().subscribe((res: any) => {
      this.lstLeaveType = res;
    })
  }
  getMinDate(): Date {
    let formtype = this.editLeaveRequest;
    const startDate = formtype.get('leave_start').value;
    const minDate = new Date(startDate);
    let daysToAdd = formtype.get('type').value.minDays - 1 // Number of days to add
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
    let formtype = this.editLeaveRequest;
    const startDate = formtype.get('leave_start').value;

    const minDate = new Date(startDate);
    let daysToAdd = formtype.get('type').value.maxDays < this.remainLeaves ? formtype.get('type').value.maxDays - 1 : this.remainLeaves - 1 // Number of days to add

    while (daysToAdd > 0) {
      minDate.setDate(minDate.getDate() + 1); // Increment date by 1 day

      // Check if the current day is not Saturday (6) or Sunday (0)
      if (minDate.getDay() !== 0 && minDate.getDay() !== 6) {
        daysToAdd--; // Decrease the count of days to add
      }
    }
    return minDate;
  }
  calculateNumberOfDays(): number {
    let formtype = this.editLeaveRequest;
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
    let numberOfDays = daysDifference + 1;
    let currentDate = new Date(start);

    while (currentDate <= end) {
      // Check if the current day is Saturday (6) or Sunday (0)
      if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
        numberOfDays--; // Decrease the count if it's a weekend
      }

      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
    formtype.patchValue({ days: numberOfDays })
    return numberOfDays;
  }
  editLeaveReaquest() {
    this.isSubmited = true;
    if (!this.editLeaveRequest.valid) {
      return
    }

    let startDate = this.model.formatDate(this.editLeaveRequest.value.leave_start);
    let endDate = this.model.formatDate(this.editLeaveRequest.value.leave_end);

    const formData = new FormData()
    formData.append('type', this.editLeaveRequest.value.type.id)
    formData.append('leave_start', startDate)
    formData.append('leave_end', endDate)
    formData.append('number_of_days', this.editLeaveRequest.value.days)
    formData.append('Reason', this.editLeaveRequest.value.reason)
    this.leaveService.editLeaveRequest(formData, this.leaveToEdit.id).subscribe(
      (res) => {
        this.getTableData()
        this.toaste.typeSuccess("Leave Edited","Succes")
        this.model.closeModel('edit_leave');
      },
      (error) => {
        this.model.closeModel('edit_leave');
      })
  }
  deleteLeaveReqest() {
    this.leaveService.deleteLeaveRequest(this.leaveToEdit.id).subscribe((res) => {
      this.getTableData();
      this.toaste.typeSuccess("Leave Deleted","Succes")
      this.model.closeModel('delete_approve');
    },
      (error) => {
        this.model.closeModel('delete_approve');
      })
  }

  openProcess(process: any) {
    this.process = process
    const totalApprovers = this.process.length;
    const approvedOrDeclined = this.process.filter(
      (approver: any) => approver.approved === 'Approved' || approver.approved === 'Declined'
    ).length;
    this.progressValue = (approvedOrDeclined / totalApprovers) * 100;
  }

  getProgressBarColor(): string {
    if (this.process.some((approver: any) => approver.approved === 'Declined')) {
      return 'warn'; // Red color for declined
    } else if (this.process.every((approver: any) => approver.approved === 'Approved')) {
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