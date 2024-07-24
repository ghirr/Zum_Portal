import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { ChangeDetectorRef } from '@angular/core';
import { UserService } from '../services/user.service';
import { common } from 'src/app/Common/common';

@Component({
  selector: 'app-attendance-admin',
  templateUrl: './attendance-admin.component.html',
  styleUrls: ['./attendance-admin.component.scss']
})
export class AttendanceAdminComponent implements OnInit {
  public lstEmployee: Array<any> = [];
  public lstEmp: Array<any> = [];
  selectedEmployee: any;
  selectedStatus: string[][] = [];
  daysInMonth: string[] = [];
  selectedMonth: any;
  selectedYear: any;
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  years: any[] = [];
  currentYear = new Date().getFullYear();
  currentMonth = ((new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1).toString());
  public routes = {
    adminDashboard: '/dashboard',
    employeeProfile: '/profile'
  };
  public statusChoices: string[] = [];
  dropdownOpen: boolean[][] = [];
  public lastIndex = 0;
  public pageSize = 10;
  public totalData = 0;
  public skip = 0;
  public limit: number = this.pageSize;
  public pageIndex = 0;
  public serialNumberArray: Array<number> = [];
  public currentPage = 1;
  public pageNumberArray: Array<number> = [];
  public totalPages = 0;
  dataSource!: MatTableDataSource<any>;
  searchEmployee: any;

  image=common.profileImage;

  constructor(private datePipe: DatePipe, private userService: UserService, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.setYears();
    this.selectedMonth = this.currentMonth;
    this.selectedYear = this.currentYear;
    this.generateDaysInMonth();
    this.getListEmp();
  }

  // Initialize the selectedStatus array with default 'Present' status
  initializeSelectedStatus(): void {
    this.selectedStatus = [];
    for (let i = 0; i < this.lstEmployee.length; i++) {
      const employeeDays = [];
      for (let j = 0; j < this.daysInMonth.length; j++) {
        employeeDays.push('Present');
      }
      this.selectedStatus.push(employeeDays);
    }
  }

  getListEmp(): void {
    this.userService.getUsers().subscribe((employees: any) => {
      this.lstEmployee = employees;
      this.dataSource = new MatTableDataSource<any>(employees);
      this.totalData = employees.length;
      this.calculateTotalPages(this.totalData, this.pageSize);
      this.updateDisplayedData();
      this.initializeDropdownState();
      this.loadAttendanceData();
    });
  }

  generateDaysInMonth(): void {
    this.daysInMonth = [];
    const daysCount = new Date(this.selectedYear, parseInt(this.selectedMonth, 10), 0).getDate();
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 1; i <= daysCount; i++) {
      const day = new Date(this.selectedYear, parseInt(this.selectedMonth, 10) - 1, i);
      const dayName = weekdays[day.getDay()];
      this.daysInMonth.push(`${dayName} ${i}`);
    }
  }

  isWeekday(dayString: string): boolean {
    const dayName = dayString.split(' ')[0];
    return dayName !== 'Sat' && dayName !== 'Sun';
  }

  onSelectionChange(): void {
    this.generateDaysInMonth();
    this.initializeSelectedStatus();
    this.loadAttendanceData();
  }

  private calculateTotalPages(totalData: number, pageSize: number): void {
    this.totalPages = Math.ceil(totalData / pageSize);
    this.pageNumberArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  getMoreData(direction: string): void {
    const totalPages = Math.ceil(this.totalData / this.pageSize);
    if (direction === 'next' && this.currentPage < totalPages) {
      this.currentPage++;
      this.skip = (this.currentPage - 1) * this.pageSize;
    } else if (direction === 'previous' && this.currentPage > 1) {
      this.currentPage--;
      this.skip = (this.currentPage - 1) * this.pageSize;
    }
    this.updateDisplayedData();
  }

  updateDisplayedData(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    if (start >= this.totalData) {
      this.lstEmployee = [];
      this.serialNumberArray = [];
    } else {
      this.lstEmployee = this.dataSource.filteredData.slice(start, end);
      this.serialNumberArray = Array.from(
        { length: Math.min(this.pageSize, this.totalData - start) },
        (_, i) => start + i + 1
      );
    }
  }

  moveToPage(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.skip = (pageNumber - 1) * this.pageSize;
    this.getListEmp();
    this.updateDisplayedData();
  }

  changePageSize(): void {
    this.pageSize = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    this.getListEmp();
  }

  setYears(): void {
    const currentYear = new Date().getFullYear();
    for (let year = 2020; year <= currentYear; year++) {
      this.years.push(year);
    }
  }

  initializeDropdownState(): void {
    this.dropdownOpen = this.lstEmployee.map(() => this.daysInMonth.map(() => false));
  }

  toggleDropdown(empIndex: number, dayIndex: number): void {
    if (!this.dropdownOpen[empIndex][dayIndex]) {
      this.dropdownOpen.forEach((emp, i) => {
        emp.forEach((day, j) => {
          if (empIndex !== i || dayIndex !== j) {
            this.dropdownOpen[i][j] = false;
          }
        });
      });
      this.dropdownOpen[empIndex][dayIndex] = true;
    } else {
      this.dropdownOpen[empIndex][dayIndex] = false;
    }
  }

  selectStatus(status: string, empIndex: number, dayIndex: number, employeeId: number): void {
    this.selectedStatus[empIndex][dayIndex] = status;
    this.dropdownOpen[empIndex][dayIndex] = false;
    this.saveAttendanceStatus(employeeId, this.selectedYear, this.selectedMonth, dayIndex + 1, status);
  }

  saveAttendanceStatus(userId: number, year: string, month: string, dayOfMonth: number, status: string): void {
    const attendanceData = {
      employee: userId,
      date: `${year}-${month}-${dayOfMonth}`,
      status: status
    };

    this.userService.updateEmployeeStatus(userId, attendanceData).subscribe();
  }

  updateEmployeeStatus(employeeId: number, statusData: { date: string, status: string }): void {
    const { date, status } = statusData;
    const year = date.substring(0, 4);
    const month = date.substring(5, 7);
    const dayOfMonth = parseInt(date.substring(8, 10));

    this.saveAttendanceStatus(employeeId, year, month, dayOfMonth, status);

    const employeeIndex = this.lstEmployee.findIndex(emp => emp.id === employeeId);
    if (employeeIndex !== -1) {
      this.selectedStatus[employeeIndex][dayOfMonth - 1] = status;
    }

    this.cd.detectChanges();
  }

  loadAttendanceData(): void {
    this.userService.getAllAttendance().subscribe(
      (attendanceData: any[]) => {
        this.updateAttendanceStatus(attendanceData);
      },
      (error: any) => {
        console.error('Error retrieving attendance data:', error);
      }
    );
  }

  updateAttendanceStatus(attendanceData: any[]): void {
    this.lstEmployee.forEach((employee, empIndex) => {
      this.selectedStatus[empIndex] = this.daysInMonth.map(() => 'Present');
      attendanceData.forEach(data => {
        if (data.employee === employee.id) {
          const date = new Date(data.date);
          if (date.getFullYear() === this.selectedYear && (date.getMonth() + 1).toString().padStart(2, '0') === this.selectedMonth) {
            const dayOfMonth = date.getDate();
            this.selectedStatus[empIndex][dayOfMonth - 1] = data.status;
          }
        }
      });
    });
    this.cd.detectChanges();
  }
}
