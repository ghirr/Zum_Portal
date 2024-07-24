import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  DataService,
  getShiftSchedule,
  routes,
} from 'src/app/core/core.index';
import { UserService } from '../services/user.service';
import { TimesheetService } from '../../timesheet/services/timesheet.service';
import { ProjectService } from '../../projects/services/project.service';
import { common } from 'src/app/Common/common';

import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';

interface Project {
  startDate: Date;
  endDate: Date;
}

interface Employee {
  position: string;
  normalHours: number;
  billableHours: number;
  notBillableHours: number;
  utilization: string;
  projects: Project[];
  activities: string[];
}

@Component({
  selector: 'app-shift-schedule',
  templateUrl: './shift-schedule.component.html',
  styleUrls: ['./shift-schedule.component.scss'],
})
export class ShiftScheduleComponent implements OnInit {
  selected1 = 'option1';
  public routes = routes;
  public lstArchivedjobs: Array<getShiftSchedule> = [];
  public searchDataValue = '';
  mytime: Date = new Date();
  myTime: Date = new Date();
  setTime: Date = new Date();
  zones: Date = new Date();
  setZone: Date = new Date();
  setzone: Date = new Date();
  dataSource!: MatTableDataSource<any>;

  timesheets: any[] = [];
  showTimePicker: Array<string> = [];

  image=common.profileImage
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
  public lstEmployee: Array<any> = [];
  users: Array<any> = [];
  selectedMonth: any;
  selectedYear: any;
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  years: any[] = [];
  public filteredEmployees: Array<any> = [];
  public filteredTimesheet: Array<any> = [];
  selectedEmployee: any;
  daysInMonth: string[] = [];
  currentYear = new Date().getFullYear();
  currentMonth = ((new Date().getMonth() + 1) < 9 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1).toString())
  selectedDay!: any;
  moreprojects:any=[];

  //** / pagination variables

 monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];



  constructor(private datePipe: DatePipe, private service: UserService,private timesheetService: TimesheetService,private projectService: ProjectService) {}

  ngOnInit(): void {
    this.setYears();
    this.selectedMonth = this.currentMonth;
    this.selectedYear = this.currentYear;
    this.generateDaysInMonth();
    this.getTableData();
    this.filterEmployeesByMonthAndYear(this.selectedMonth, this.selectedYear, this.selectedDay);
    console.log(this.filteredEmployees);
    console.log(this.lstEmployee);
    
    
  }
  private getTableData(): void {
    this.timesheetService.getEmployeeTimesheets().subscribe((employeeTimesheets: any) => {
        // Assign the received data to this.dataSource
        this.dataSource = new MatTableDataSource<any>(employeeTimesheets);
  
        // Update this.totalData with the length of the received data
        this.totalData = employeeTimesheets.length;
  
        // Call the updateDisplayedData() method to ensure proper pagination
        this.updateDisplayedData();
        
  
        // Filter employees based on selected month and year after setting up the data source
    });
  }
  filterEmployeesByMonthAndYear(month: number, year: number, day: number): void {
    // Filter employees based on selected month, year, and day
    this.filteredEmployees = this.lstEmployee.filter(employee => {
        // Check if any project of the employee is active during the selected month, year, and day
        return employee.projects.some((project: any) => {
            return this.isProjectActiveDuringMonth(project, year, month, day);
        });
    });

    // Update lstEmployee with filtered employees
    // It's better to assign the filtered employees to a different array instead of modifying the original one directly
    // This ensures that the original data remains intact for subsequent filtering operations
    this.lstEmployee = this.filteredEmployees;
}


generateDaysInMonth() {
  this.daysInMonth = []; // Clear the existing days
  const daysCount = new Date(this.selectedYear, parseInt(this.selectedMonth), 0).getDate();
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']; // Weekday names
  for (let i = 1; i <= daysCount; i++) {
      const day = new Date(this.selectedYear, parseInt(this.selectedMonth) - 1, i);
      const dayName = weekdays[day.getDay()]; // Get the weekday of the day
      this.daysInMonth.push(`${dayName} ${i}`);
  }
}
isWeekday(dayString: string): boolean {
  const dayName = dayString.split(' ')[0]; // Extract weekday abbreviation
  return dayName !== 'Sat' && dayName !== 'Sun'; // Check if it's not Saturday or Sunday
}


onSelectionChange() {
  this.generateDaysInMonth();
}

  getTotalWorkingDays(): number {
    const currentDate = new Date(this.selectedYear, parseInt(this.selectedMonth) - 1, 1);
    const lastDayOfMonth = new Date(this.selectedYear, parseInt(this.selectedMonth), 0).getDate();
    let workingDays = 0;
    for (let i = 1; i <= lastDayOfMonth; i++) {
      currentDate.setDate(i);
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Exclude weekends (0 = Sunday, 6 = Saturday)
        workingDays++;
      }
    }
    return workingDays;
  }
  calculateUtilization(employee: any,billableHours:any,notBillableHours:any): number {
    const normalHours = this.calculateNormalHoursForEmployee(employee);
  
    const utilization = ((billableHours + notBillableHours) / normalHours) * 100;
    return Math.round(utilization * 10) / 10; // Round to two decimal places
  }  

  calculateNormalHoursForEmployee(item: any): number {
    const totalWorkingDays = this.getTotalWorkingDays();

    const normalHoursPerDay = totalWorkingDays * 8; // Assuming 'totalHours' is the total working hours for the month
    
    return normalHoursPerDay;
  }
  
  public sortData(sort: Sort) {
    const data = this.lstArchivedjobs.slice();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (!sort.active || sort.direction === '') {
      this.lstArchivedjobs = data;
    } else {
      this.lstArchivedjobs = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.lstEmployee = this.dataSource.filteredData;
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
    this.calculateTotalPages(this.totalData, this.pageSize);
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
    
    this.calculateTotalPages(this.totalData, this.pageSize);
  } 
  isProjectActiveDuringMonth(project: any, year: number, month: number, day: number): boolean {
    const projectStartDate = new Date(project.starter_at);
    projectStartDate.setHours(0, 0, 0, 0); // Set project start date to midnight
  
    const projectEndDate = new Date(project.end_date);
    projectEndDate.setHours(23, 59, 59, 999); // Set project end date to the end of the day
  
    // Check if the project starts before or on the selected day
    const startsBeforeOrOnDay = projectStartDate <= new Date(year, month - 1, day);
  
    // Check if the project ends after or on the selected day
    const endsAfterOrOnDay = projectEndDate >= new Date(year, month - 1, day);
  
    // Check if the project spans across the selected day
    const isProjectActiveDuringDay = startsBeforeOrOnDay && endsAfterOrOnDay;
  
    return isProjectActiveDuringDay;
  }
  
  setYears() {
    const currentYear = new Date().getFullYear();
    for (let year = 2020; year <= currentYear; year++) {
      this.years.push(year);
    }
  }
  

  public moveToPage(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.skip = this.pageSelection[pageNumber - 1].skip;
    this.limit = this.pageSelection[pageNumber - 1].limit;
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
    this.totalPages = Math.ceil(totalData / pageSize);
    this.pageNumberArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.pageSelection = this.pageNumberArray.map((pageNumber) => ({
      skip: (pageNumber - 1) * pageSize,
      limit: pageSize,
    }));
  }

  toggleTimePcker(value: string): void {
    if (this.showTimePicker[0] !== value) {
      this.showTimePicker[0] = value;
    } else {
      this.showTimePicker = [];
    }
  }
  
  parseInt(value: string): number {
    return parseInt(value, 10);
  }

  formatTime(date: any): any {
    const selectedDate: Date = new Date(date);
    return this.datePipe.transform(selectedDate, 'h:mm a');
  }

  async exportToExcel(month: number, year: number): Promise<void> {
    try {
        // Mettez à jour les données affichées si nécessaire
        this.updateDisplayedData();

        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet(this.monthNames[month - 1]);

        // Ajoutez les en-têtes de colonne
        worksheet.addRow(['Employee Name', 'Position', 'Normal Hours', 'Billable Hours', 'Not Billable Hours', 'Utilisation', ...this.daysInMonth]);

        // Ajoutez les données des employés
        this.dataSource.filteredData.forEach(employee => {
            const rowData = [
                `${employee.employee.firstname} ${employee.employee.lastname}`,
                employee.employee.position,
                this.calculateNormalHoursForEmployee(employee),
                employee.monthly_billable_hours[this.selectedYear + '-' + this.selectedMonth] || 0,
                employee.monthly_not_billable_hours[this.selectedYear + '-' + this.selectedMonth] || 0,
                this.calculateUtilization(employee, employee.monthly_billable_hours[this.selectedYear + '-' + this.selectedMonth] || 0, employee.monthly_not_billable_hours[this.selectedYear + '-' + this.selectedMonth] || 0)
            ];

            // Ajoutez les données pour chaque jour du mois
            this.daysInMonth.forEach(dayString => {
                // Votre logique pour extraire les données du projet pour chaque jour
                // Je suppose que vous avez une fonction pour cela
                const projectData = this.extractProjectDataForEmployee(employee, dayString);
                rowData.push(projectData); // Ajoutez les données du projet pour ce jour
            });

            worksheet.addRow(rowData);
        });

        // Convertissez le classeur Excel en un blob et téléchargez-le
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), `ResourceAllocation_${this.monthNames[month - 1]}_${year}.xlsx`);
    } catch (error) {
        console.error("Error exporting to excel:", error);
        // Gérer l'erreur ici, par exemple afficher un message d'erreur à l'utilisateur
    }
}

  getColumnLetter(columnNumber: number): string {
    let dividend = columnNumber + 1;
    let columnLetter = '';
    let modulo: number;

    while (dividend > 0) {
        modulo = (dividend - 1) % 26;
        columnLetter = String.fromCharCode(65 + modulo) + columnLetter;
        dividend = Math.floor((dividend - modulo) / 26);
    }

    return columnLetter;
}
extractProjectDataForEmployee(employee: any, day: string): string {
  // Implémentez votre logique pour extraire les données du projet pour l'employé et le jour donnés
  // Par exemple, vous pouvez parcourir les projets de l'employé et trouver ceux qui sont actifs ce jour-là
  // Ensuite, vous pouvez renvoyer une chaîne représentant ces données de projet pour ce jour

  // Exemple de logique fictive :
  let projectData = '';
  employee.projects.forEach((project:any) => {
      if (this.isProjectActiveDuringMonth(project, this.selectedYear, this.selectedMonth, parseInt(day.split(' ')[1]))) {
          // Ajoutez les données du projet à la chaîne projectData
          projectData += `${project.abbreviation}, `;
      }
  });

  // Supprimez la virgule finale de la chaîne projectData si elle n'est pas vide
  if (projectData.length > 0) {
      projectData = projectData.slice(0, -2);
  }

  return projectData;
}


  // Méthode de mise à jour d
}
export interface pageSelection {
  skip: number;
  limit: number;
}
