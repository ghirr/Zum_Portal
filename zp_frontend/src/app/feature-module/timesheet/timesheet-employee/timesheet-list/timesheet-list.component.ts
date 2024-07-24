import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { routes } from 'src/app/core/core.index';
import { TimesheetService } from '../../services/timesheet.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/feature-module/authentication/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from 'src/app/core/services/toaster/toaster.service';
import { ModalService } from 'src/app/Common/commonservices/modal.service';


@Component({
  selector: 'app-timesheet-list',
  templateUrl: './timesheet-list.component.html',
  styleUrls: ['./timesheet-list.component.scss']
})
export class TimesheetListComponent implements OnInit {
  public lstTimesheet: Array<any> = [];
  public filteredTimesheet: Array<any> = [];
  public searchDataValue = '';
  dataSource!: MatTableDataSource<any>;
  public routes = routes;
  id: any;
  employeeId: any;
  addTimesheetForm!: FormGroup;
  editTimesheetForm!: FormGroup;
  error: Boolean = false;
  tasks: Array<task> = [];
  Edittasks: Array<task> = [];
  today = new Date;
  editTimesheet: any;
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  years: any[] = [];
  employees: any[] = [];
  selectedMonth: any;
  selectedYear: any;
  selectedEmployee: any;
  currentYear = new Date().getFullYear();
  currentMonth = ((new Date().getMonth() + 1) < 9 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1).toString())
  permissions:any=[];
  constructor(private AR: ActivatedRoute, private timesheetService: TimesheetService,private modal:ModalService,
    private authService: AuthService, private formBuilder: FormBuilder, private toaster: ToasterService) { }

  ngOnInit(): void {
    this.id = this.AR.snapshot.paramMap.get("id")
    this.employeeId = this.authService.getUser().id
    this.permissions=this.authService.getUser().permissions;
    this.addTimesheetForm = this.formBuilder.group({
      employee: this.employeeId,
      project: this.id,
      tasks: [],
      date: [this.today, Validators.required],
      location: ['Zum-it Office', Validators.required],
      site: ['TN', Validators.required],
      billablehours: ['8', Validators.required],
      notbillablehours: ['0', Validators.required]
    })
    this.editTimesheetForm = this.formBuilder.group({
      id: '',
      employee: this.employeeId,
      project: this.id,
      tasks: [],
      date: [this.today, Validators.required],
      location: ['Zum-it Office', Validators.required],
      site: ['TN', Validators.required],
      billablehours: ['8', Validators.required],
      notbillablehours: ['0', Validators.required]
    })
    this.selectedEmployee = this.employeeId;
    this.selectedMonth = this.currentMonth;
    this.selectedYear = this.currentYear;
    this.setYears();
    this.getProjectEmployees(this.id)
    this.getTableData();
  }

  ngOnChanges(): void {
    if (this.editTimesheet) {
      this.editTimesheetForm.patchValue({
        id: this.editTimesheet.id,
        date: this.editTimesheet.date,
        location: this.editTimesheet.location,
        site: this.editTimesheet.site,
        billablehours: parseInt(this.editTimesheet.billablehours),
        notbillablehours: parseInt(this.editTimesheet.notbillablehours),
      });
      for (let index = 0; index < this.editTimesheet.tasks.length; index++) {
        this.tasks.push(this.editTimesheet.tasks[index])
      }

    }
    // Set the value of the 'billable' radio button
    const billableValue = this.editTimesheet.billable === true ? 'true' : 'false';
    this.editTimesheetForm.get('billable')?.setValue(billableValue);

  }

  // ------------------------------------------ Lister Timesheet ------------------------------------ //
  setYears() {
    const currentYear = new Date().getFullYear();
    for (let year = 2020; year <= currentYear; year++) {
      this.years.push(year);
    }
  }
  getProjectEmployees(projectId: any) {
    this.timesheetService.getEmployeesByProjectId(projectId).subscribe((res) => {
      this.employees = res;
    }
    )
  }
  private getTableData(): void {
    this.timesheetService.getTimesheetByProjectId(this.id).subscribe((res: any) => {
      this.filteredTimesheet = res;
      this.filterTimesheet()
    });
  }
  filterTimesheet(): void {
    let filtred: any[] = [];
    if (this.selectedMonth && this.selectedYear) {
      filtred = this.filteredTimesheet.filter((timesheet: any) => {
        let year = timesheet.date.slice(0, 4);
        let month = timesheet.date.slice(5, 7);
        return month == this.selectedMonth && year == this.selectedYear && timesheet.employee.id == this.selectedEmployee
      })
    }
    else {
      filtred = this.filteredTimesheet
    }
    this.lstTimesheet = filtred;
  };
  public sortData(sort: Sort) {
    const data = this.lstTimesheet.slice();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (!sort.active || sort.direction === '') {
      this.lstTimesheet = data;
    } else {
      this.lstTimesheet = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }
  calculateTotalBillableHours(): number {
    return this.lstTimesheet.reduce((total, item) => total + item.billablehours, 0);
  }
  calculateTotalNotBillableHours(): number {
    return this.lstTimesheet.reduce((total, item) => total + item.notbillablehours, 0);
  }

  // ------------------------------------------ ADD EDIT DELETE Timesheet ------------------------------------ //
  addTask(event: KeyboardEvent, billable: boolean) {
    const target = event.target as HTMLInputElement; // Typecast event.target to HTMLInputElement
    if (event.key === 'Enter') {
        let task: task = {
            status: 'Pending',
            task: target.value.trim(),
            billable: billable
        };
        if (task.task !== '') {
            this.tasks.push(task);
            target.value = '';
        }
    }
  }
  onStatusChange(index: number, status: String) {
    this.tasks[index].status = status;
  }
  getTasksByBillableStatus(item: any, billable: boolean): any[] {
    return item?.tasks.filter((task: task) => task.billable === billable) || [];
  };
  hasTasksByBillableStatus(timesheet: any, billable: boolean): boolean {
      return timesheet?.tasks.some((task: task) => task.billable === billable);
  };
  deleteTask(index: number): void {
    this.tasks.splice(index, 1); // Remove the task at the given index
  }
  addTimesheet() {
    if (!(this.addTimesheetForm.valid) || this.tasks.length == 0) {
      return
    }
    else {
      const dateValue = this.modal.formatDate(this.addTimesheetForm.value.date)

      this.addTimesheetForm.value.date = dateValue;
      this.addTimesheetForm.value.tasks = this.tasks;
      this.timesheetService.addTimesheet(this.addTimesheetForm.value).subscribe((res) => {
        this.getTableData();
        this.toaster.typeSuccess("Timesheet Added","Sucess")
        this.modal.closeModel('add_todaywork');
      },
        (error) => {
          if (error.error) {
            this.error = true
          }
          else {
            this.modal.closeModel('add_todaywork');
          }
        })
    }

  }
  updateTimesheet() {
    if (!(this.editTimesheetForm.valid) || this.tasks.length == 0) {
      return
    }
    else {

      this.editTimesheetForm.value.tasks = this.tasks;
      this.timesheetService.editTimesheet(this.editTimesheetForm.value).subscribe((res) => {
        this.getTableData();
        this.toaster.typeSuccess("Timesheet Edited","Sucess")
        this.modal.closeModel('edit_todaywork');
      },
        (error) => {
          this.modal.closeModel('edit_todaywork');
        })
    }
  }
  deleteTimesheet() {
    this.timesheetService.deleteTimesheet(this.editTimesheet.id).subscribe((res) => {
      this.getTableData();
      this.resetForm();
      this.toaster.typeSuccess("Timesheet Deleted","Sucess")
      this.modal.closeModel('delete_workdetail');
    },
      (error) => {
        this.modal.closeModel('delete_workdetail');
      })
  }
  downloadTimesheets() {
    this.timesheetService.downloadTimesheets(this.employeeId, this.selectedMonth, this.selectedYear).subscribe(
      (data: Blob) => {
        const employee = this.employees.filter(employee => employee.id == this.employeeId)[0]
        const filename = 'timesheet-' + employee.firstname + employee.lastname + '-' + this.selectedMonth + '-' + this.selectedYear + '.xlsx'; // Specify the filename here
        const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);

        // Create a temporary link element to trigger the download
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();

        // Clean up
        window.URL.revokeObjectURL(url);
      }
    );
  }
  resetForm() {
    this.tasks = [];
    this.error = false
  }
  openEditModal(timesheet: any, tasks: any) {
    this.editTimesheet = timesheet;
    this.editTimesheet.tasks = tasks;

    this.ngOnChanges();
  }
}
export interface task {
  status: String;
  task: String;
  billable: Boolean;
}