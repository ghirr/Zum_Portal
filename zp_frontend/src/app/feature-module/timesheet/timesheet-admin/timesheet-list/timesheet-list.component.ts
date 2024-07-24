import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { routes } from 'src/app/core/core.index';
import { TimesheetService } from '../../services/timesheet.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/feature-module/authentication/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from 'src/app/core/services/toaster/toaster.service';
import { Workbook } from 'exceljs';

import { ProjectService } from '../../../projects/services/project.service';
import { ModalService } from 'src/app/Common/commonservices/modal.service';

@Component({
  selector: 'app-timesheet-list',
  templateUrl: './timesheet-list.component.html',
  styleUrls: ['./timesheet-list.component.scss']
})
export class TimesheetListComponent implements OnInit {
  public lstTimesheet: Array<any> = [];
  public filteredTimesheet: Array<any> = [];
  public routes = routes;
  selectedFile: File | undefined;
  id: any;
  employeeId: any;
  editTimesheetForm!: FormGroup;
  tasks: Array<task> = [];
  editTimesheet: any;
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  years: any[] = [];
  employees: any[] = [];
  selectedEmployee: any;
  selectedMonth: any;
  selectedYear: any;
  currentYear = new Date().getFullYear();
  currentMonth = ((new Date().getMonth() + 1) < 9 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1).toString())
  permissions:any=[];
  
  constructor(private AR: ActivatedRoute, private timesheetService: TimesheetService,
    private authService: AuthService, private formBuilder: FormBuilder, private toaster: ToasterService,private service: ProjectService, private model:ModalService) { }
   


  ngOnInit(): void {
    this.id = this.AR.snapshot.paramMap.get("id")
    this.employeeId = this.authService.getUser().id
    this.permissions=this.authService.getUser().permissions;
    this.editTimesheetForm = this.formBuilder.group({
      id: '',
      employee: this.employeeId,
      project: this.id,
      tasks: [],
      date: ['', Validators.required],
      location: ['Zum-it Office', Validators.required],
      site: ['TN', Validators.required],
      billablehours: ['8', Validators.required],
      notbillablehours: ['0', Validators.required]
    })
    this.getProjectEmployees(this.id);
    this.setYears();
    this.selectedMonth = this.currentMonth;
    this.selectedYear = this.currentYear;
    this.getTableData();

  };

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

  };
  setYears() {
    for (let year = 2020; year <= this.currentYear; year++) {
      this.years.push(year);
    }
  };
  getProjectEmployees(projectId: any) {
    this.timesheetService.getEmployeesByProjectId(projectId).subscribe((res) => {
      this.employees = res;
      this.selectedEmployee = res[0].id;
      
    })}
    
 
  /*  -----------                  Lister et chercher timesheet                    ----------- */
  private getTableData(): void {
    this.timesheetService.getTimesheetByProjectId(this.id).subscribe((res: any) => {
      this.filteredTimesheet = res;
      this.filterTimesheet()
    });
  };
  filterTimesheet(): void {
    this.lstTimesheet = [];
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
  calculateTotalBillableHours(): number {
    return this.lstTimesheet.reduce((total, item) => total + item.billablehours, 0);
  };
  calculateTotalNotBillableHours(): number {
    return this.lstTimesheet.reduce((total, item) => total + item.notbillablehours, 0);
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
  };
  
  /*  -----------                  Edit and Delete Timesheet                    ----------- */
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
  };
  getTasksByBillableStatus(item: any, billable: boolean): any[] {
    return item?.tasks.filter((task: task) => task.billable === billable) || [];
  };
  hasTasksByBillableStatus(timesheet: any, billable: boolean): boolean {
    return timesheet?.tasks.some((task: task) => task.billable === billable);
  };
  deleteTask(index: number): void {
    this.tasks.splice(index, 1); // Remove the task at the given index
  };
  onStatusChange(index: number, status: String) {
    this.tasks[index].status = status;
  };
  updateTimesheet() {
    if (!(this.editTimesheetForm.valid) || this.tasks.length == 0) {
      return
    }
    else {
      
      this.editTimesheetForm.value.tasks = this.tasks;
      this.timesheetService.editTimesheet(this.editTimesheetForm.value).subscribe((res) => {
        this.getTableData();
        this.toaster.typeSuccess("Timesheet Edited","Success")
        this.model.closeModel('edit_todaywork');
      },
      (error) => {
        this.model.closeModel('edit_todaywork');
      })
    }
  };
  deleteTimesheet() {
    this.timesheetService.deleteTimesheet(this.editTimesheet.id).subscribe((res) => {
      this.getTableData();
      this.toaster.typeSuccess("Timesheet Deleted","Success")
      this.model.closeModel('delete_workdetail');
    },
    (error) => {
      this.model.closeModel('delete_workdetail');
    })
  };
  
  capitalizeFirstLetter(content: String) {
    return content.charAt(0).toUpperCase() + content.slice(1);
  }
  
  
  downloadTimesheets() {
    
    this.service.getProjectById(this.id).subscribe(
      res => {
        let projectName="";
        projectName=res.name;        
        const  data =this.lstTimesheet;
        const employee = this.employees.filter(employee => employee.id == this.selectedEmployee)[0];
        const filename = 'timesheet-' + employee.firstname + employee.lastname + '-' + this.selectedMonth + '-' + this.selectedYear + '.xlsx'; // Specify the filename here
        //#endregion
        
        //#region ZUM logo base-64
        var myBase64Image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAAIABJREFUeF7sfQeYVEXW9ls3dp48DEMOEiXnLKKgiCIIiICIoIKyKhIUFFBAQUWQRQRRUEGUHAwoQZCcM5JzZgITejrdvqH+p3qY/fhZkJlxmpXpvvu4PXRX1a06dd6qU1Wn3kMQfsISCEvgthIgYdmEJRCWwO0lEAZIWDvCEvgLCYQBElaPsATCAAnrQFgC+ZNAeAbJn9zCuUJEAmGAhEhHh5uZPwmEAZI/uYVzhYgEwgAJkY4ONzN/EggDJH9yC+cKEQmEARIiHR1uZv4kEAZI/uQWzhUiEggDJEQ6OtzM/EkgDJD8yS2cK0QkEAZIiHR0uJn5k0AYIPmTWzhXiEggDJAQ6ehwM/MngTBA8ie3cK4QkUAYICHS0eFm5k8CYYDkT27hXCEigTBAQqSjw83MnwTCAMmf3MK5QkQCYYCESEeHm5k/CYQBkj+5hXOFiATCAAmRjqaUcgsB0oUQPUSaXCDNDAPkDmI8Qanjl81/viREFVHS3N6iUeaIdL/q41U9S5ZMZr9hCCA6R/PbG5Tgb/WBYXAcK0PjNAAGeAKdo9SQdIECIgSTxcjweh2cxaQYul8wC8SlOdN5BwxntRLxO5slWnfnt+6hkO9vdU5hF9AZSk2z158YvWTXwU5uOcZh8Ga7RESfpno53fDwnEAoJRJHwf2VKP5/GdNcAILgdoC78ftAuYTwoASCJugGJZQjFAZHQXmDNwjhOUWlvKrpPJGEQC1tAqfC69IEt8tbs1Ts7oFPNnyurpVcKex9md/2hQHyF5L75QptOfanDV+cM8wVsjgLBMECPcsFSeTASxSqoYKCz6/sCySfrrOZA9A5gwEFhGR3KaEcAl+Ag9lshcfjAc+wqRmIslqgZLkRSzzuro3u+6Rn3diPShDiLZAKFbJCwgC5TYfup7T4J0uPz16b7G6ZTGSIZhs0lwtRBoFEDPgMP0RRADUMkHwbWH9Tm4gGgdMD72czCZA99egMG2D/GTA0HRZJhuJVwBEJfl2AzkngZAvgy0BFh+/woA71ej8ZQbb/zdoUyuxhgNyiW5Mptc3503jtq/V7Bl+2RkZlUhWy4kajiqXPlJPlI4KmUpfqt4omyc1rVCQUlIIabAAHgUFpYCCnOZ9gNhiBwT5pYFwnTIUDan3jJyGUo5QYN3/P/p1dPmHWU+Az27zSiEbdOm9AFwxJh8GDEIFTeYP3E503ONUQDd0LTRUsvNVPicWcaQjxGw6dqpchWcBeFQsPfaBc7JIRD5XqU46QzEKp5X+jUWGA3EJ4GxRaZfi3u+afJpb7rwoUVpOOahbftgHt679aFThjAAoPEBHgfEBgV0jLHrQRB9AUBpSbnpzv2eft+ovluzHdX/2blSEDHKuDkV2mUv56Xc4CggKIruzftWjAcAK6CTBfBBLnbUt9e9mR092zOJmYICIyKyVjXKcW3TolYAVhWAw//5FAGCA3KcMRSmO+Xn/h42UHkrql8iaTImuIRHrq64/UHNGqWNTMuoSo97L+UEr5BS40Hz1/5VdXDFM5lTpg8/vQumTUitefqNSnNiGX7+X2FXTdwwC5SaJzkmmnKct2/fu8T0pUCIXd5EWtRMuGEW2rd6pNSEpBd8D/ory9lEb+svfSq0u3/flCMo0uaUBAnKRmdmtWfULHiqaP7yNE+V/U65/4zjBAbuiVPZTGfbDsyLI9VzyNfbwFRPcg3kg//c5zD/WpYsOWqoT4/4mdmNc6UUrZijz+g29Wzvsz0/SA4SgCRclEWRs59Mmz9ds0JuRSXsssrOnDALnes4colTaecvb9+OetI722uFifoiKW86NzrXIfdW+Y+H5VQlyFSQkuU2qZfyTtpa/W7/8wmVpknwEUFeHqWCVxVremJd6qQYi7MLU3v20JA4Rth1LKb/XjvrGLtn21O1Nv6iE8HKKBChZyaswzjVoUxhH1BKVyOhA/9ucDy3ZeddX2cXZImopSetbx0b1adG9tJbvyq1SFKV8YIACYO8m0DVc+W37odNdkXpYoNMTp6ZcHPPHQsAbFxLn3+sL8dgp7iFLbxmQ8OfW3zR8mGVHFMjNdKGnm6SP3xc999cESvcNrkVtsRxYm9Oe2LcuctNlbX6+f55SjEhWOQlRS0bpC3PyBbar3q0VIRm7LudfSsZlzOxA7Y8O5CUv3nO9ObDHgFAWJxH1pVIem3donkg33WpsKur4hP4NsprTU+3M3f3vAZX/AqQuI4lUU0TIuffJyi2bNgbOhcC7wOzv3mbPjl0u6XCbL4GDXfWgeKfz2drdaPaoSklbQSncvlRfSANlFqWX18azXp6/ePijDVDyG+S8V8ab4uzWu+sXzdSKHhop/0gVKzbP2ZY3+dv2u19ItsRIMikSPM+VfjzUd9VIFTA2FQeJ2oA1pgPzqprXeW7J5zgk3X8UHK2I4DvXs2sahT9Z4roGZnLmXRrq/W9ddlJb7YN72b3a4hGZOXUakTnGfmf456vnqjzUj5PzfLf9ezR+yADlIaZGvNp7/aOmxC92dnFWQDQHRijPrnSca921VAj8mEuK5Vzs1P/WmlAqzznt6j/px60feiOKRHpeOeF7Tn6lZZHzXBkXeLSxnQHmVTcgCZOZZ2ufzFevfPWVIJSSTDeasNLSuWOKX19qU7VmdkPS8CrIwpGe7eaNWHF266mTqg25THARNQQUh4+jbXZo/1yGC7CgMbcxrG0ISIIcoTXh38cEFOy5nNvOYbAFFqCj4D7/Vpdmr5ghsaElI9iWLEHwWOmn74bNWf55sLlZMJxwcnst4tHzi928/UumFMoT4Qk0kIQcQtiCdvT912JzNR1/LIOYI5oBu82ekvdS8xsfP1oibkhDiJ8jMT2v2poufLD54qY9HtEDQ3YhTnVffbv/AgGdKyvPDACnkEmBnHp8u2fDpGTWyjlvnIPvSjQYlHRuGdKjRozCemOenO9m279hF+xYeSHJWoWYZDuJHoxhp9SudGvRqGmLeviE1gzBX9snrDn++/NCFjl5bOVH1qSgjuc+/0KrG+w+UFGeF6kL0ZhDtolT8/U/Pe7P+2PVqEifbrQ4ZNueljG4P1Pysa9ViH4TSCXtIAeSHJOWp8cs3f3reL5fwkwhYdAVt7ouc+9pDZQfVJWHighuBstlLS01YvO+HHRlKY68owIIslLUaR0Z0f7DdQ4Sczs/MdC/mCRmAsNlj6Pdb52zM4B7RzFEw+zwobfIe/aB3o8dCqcNzq6TMu/lwEjqOXbpj8jm/HifbTJDVdDxWKfGbV1tUer0SIVm5LeteThcSALlKqfXb3cmDZm079nySuXhphYgwea5qzz1Sd+rj5TCuJSFX2R2J250Y5/zGPoEAjQlLHLhqy7xi2eetzI6b8rG8Of+xa60Gy7cO4B+4oTz23fX3XL93/n9Eb4z8jZVxEhDKAzl3U/h1AIKx87Y/i8ZP2XT+u40XUlonUwGakoVa0fKxV9rWG/h0NPn1Xlb83Na90AOEjYQnU9Hkk6VbpxxzCVVc1jhoHBAfRfB0m1JfJgjYYdfgMqsQRQOMeM3LE/h1CslvQBIE+DRDF00W/hrRIegaIngeus8NmVJokgg/z0GXeGiqAisFOMEEr6pDVBmhmwGR40ANHQFSB+G6g6jAyFA40Jy77JwOGkAeQDUenE7AqkNEDn7CQVUVmHkOKidCoTo4AhiaBnh02CIJlBh3prNVmYg/SAFvUc9Pok9+tGjNx5eluPs84BBNfWhc3LF68KMVuheWG5Z/BZZCD5CjlCZ+uuLgJ6tP+To55RjRRyS4fFmwOAxwqtuIMEiGrKpeUdcIoarBE0MVOAGUUEnTNfBEU1XdT3lepKoODpQ3EcJBFmTN0FTdxENVNR/HCYRTVJck8jI4QSSKRjhFJwIvmwKMCgSGzlPdEKjGWEjYVyIlBjE4qgS45AyzZBgiRwlVQQxCOZUn4DhVhWYWLYaqQtZ1lUoy8YmCoUHzEr+qC1QwSQ5DyWgYIezq+1ibQVXiCnYtdZRS+8Q/TkxaccbXOx0mcIqHOXOmD+/YqO+zxaTFhDAWlsL7FGqAMHfuhZdcHcZ+v/LDK44q5TJ5O0SJh6q5IFh1eJyZsMAM0eBBoYPqGjjo4DiAC7DvGBBFMcDfo6kG/JoG2WyFT9FhsTrgdftgEUzweJzgbTpAfLDLJniyXOA5C8Cb4DZoAA08NIjQwHSbOQNSwmVzV/FagHxOp3aAitnkbzBAoAY4gniDh8DJ4KgAv98Pg6qB+jECIIEQCCaAXj2d/m6n1oN6V7J9EwxVXUFp1QHfHd52RTfbqG4gSk1Hk0jfb+90bVrovX0LO0DIJi/qj567Ydohf3ytZGoC4TTIkgHNyIJNEjTeqwsC5WFwPAzDgEGZaa+DJxQ8B3i8XphMlgDRlcLsJsZSqFJAcsBv8OBhBuFUMEopXUuHlSrQvQqspgioBg8/F6AG/Q84BJrNHa2yySgABj3AlEWpFQbEAIVWgGM3ABADvMHB59UgyTYQ2QSFAjovwqAcZE6D6EtG03IxKwY/Uu7ZuoSkBgMgqymtNmDO4c0XFNHOcQJsnhTUFtM3jXy6Ta+6keRUMN75TymzUAOECfkUpRE/7EgeNnPL6QGpcqTMWURIIuBPT9EqxDnORvldbplqis6Lus5xRDf8IhgjNGNnCxhdoKIocIyAV9F0UZNkTTdHkqNXMu/X5ChkenhYTRyI5zzKxIlX4uDNEHW/InEW3edTZV2QRcZuLRLVwxuGxlNDZSDwEsnKeEFlQzU4DRo4SQ3MJEQ0McOLo2qAcksWBC3L77dylmg91U/jzjvVYopkhcqbYfZmopop88ibXZq+/LgNG4Nh7hyjNHba5kvjfzyc0vOKj3Bs4VWUeH0vN6s4oknN6H8X1tuWOQAt9ABhDWU0om/NPbhsX5qvjtdkgqIoKGa3XOvbscrA6lZsiQR8zPBRAcMEmNhanTkdSdmEbMwvS9AATgeMDEDKAEpPXHhy/oV0xWGIETBRH2L0q2feeKbp2/fbsEcA/H4FoiDDbwAyyysDGg/olE0ejOUNENn3JkCzZbOFquz9frbIBxhXO68AzCmM2fhCClB01UFl0I/bDnRyUVNgJrO5ktC/QalRvWonBoVbl+2azUtC108WrH7/khhbRuPNcGg+NCoWsf3NJ8p0qkHIxX/KSB+seoQEQAJkaU48NGbOms+SxYj7DMkCzu1GkzJxO4c8WrpDI+Bybi4FsXLWAsV/Puh5e+GWg308nIlnppdNy/I/27DSpJ41Y8ZnAZkFPapuotR+zIvWkxZtmpJi2BMyFQOSoaB+gmnnpCdrPhKsW387KS07+oftC/9M02tn8DZYeB4lec/ZAY/Xe6NLPH4KxowVLEXPb7khAZDr5xWO6VsvfDBv54k+binCLBAO8Zw/o1fDsh92rRY3OTe3B5kLxgknWk9YsmPCeYWv6NY02DifUb945K43H6/xTNPsK7oFvquzjRFp/3Zg7u7L7qYXnRSRNjuKCq5zAx9rNKhXEbI4v53/V/kOURo9b/v5EYsPXOybRq1mn6IhmtN8PRtVmty9dgRzN3EG473/tDJDBiBM8JspLff2t9t+OqMIVVySCZzfgyo2sm9ol3q920pk7191Dju82wuUfPfXC4u3nU+v45NMkIkHiSTlXL/WDUd1TLQvCIYn8C5KI9adzOr/xeqjI1MMq2ySHbD50tG5Zuy/n21adHgw+LrY5akFKej40dK1404ZtrIKEVCEUFSP4g+M6lzzoVA4/wipNUhOY5mr+0/n8dLkpWtHp1giHCp4RBl+tU2V4gvebJb4yl+Nimyxv+iIZ9Bnaw4PSRPtJkGksChX0b1eyc+71C37bn0gI+d0vSBHwZVuWmfi0j1f/umy1s7084jhOVSy6qfee/q+hxqZydmCfFdOWYcpLTpq6eF5f1xKbe62RoGoGsoTd9LQDk0HdI0j84Lxzn9qmSE1g1xfsMdPWXX0i2WHr3Tw22PB6wYS4Lk6qG31wQ2LWxfeyqOXzR5rvWg0ZsHOLw975apeCDBrqagZzx8c3aXJUw0JORGMDmaHdFPXnPvytz8vdsyUYyVZkmBLv5LxetvG7/SrQqYG453M8+CXbWnDvt51ZGCyaHUYsgi7PwtPVYr/4qXmZYcEY8YKRjsKqsyQAwgT3Co/rfn2rK1LLujWMi4DiBE0NIhQ/xjQvsGLTUz/va/PRtQJK0/OXHM8pXUmb+fNEkWceunS6+2bjXg+0To7GDMHA+W8U3qXj3/b8ukVzlqUmTl23UvbVSyysP/DpV8O1sJ85TXaeOwPGz4/I0fUdBociJqF2gmWAyM71WzXgpALBaV490o5IQkQxks7fa979Lwtx15Kgmg3iUCClpnRtkaZuc83KfbGjY6HzNFxySml95Q1h0dcVLg4kyTAoaXhiftjv+7VovLgYN1f3+mjZccv3Pn1Nq/UIpNIEHUnSvGec+91bPnM4zFkazAUjG0GTP75yMwdF50PZsAkSDxQlLjO9mpd//0HS4nfheJ9mZAECFOuPZQmjpl/eO6OVFdzRTTB5HGjUqR0bGDHOr3aRpBtLA0bxf8Aqo/7bvuXu9PE+pw1EiZfGu6z+c68+VTD7o86xKAoKrv2+uPOy6OW7DzV8yxxRFKBQ4KW6nmuRbVPnq4SOzYYF5YYYcOyk94XpqzaPcItRUQafhXRhgtPVE6c0b9V+cFlAWdutsKDAdz/ZZkhCxC2ZZvsQuO35q2ZkwRbcarKsCpetCwV9VP/DpX6MLcNttU5dd3JWasOXW7rMSdyWZlOlDP7knq3qvXBU/eZZwaDGohtJOx1odGoeevnXVStcV52OMc8aCOM1WO61utWMUjuJD95aYv35m2fflSPrOgnBAlKGmra9L3vPdvksVC+TBayAGGjEtuZmrbr3GeLd53qmqFFilbJhigt/ULnB+vMaFtJ+Gpfqt5y+i9bP73gFuI9fgExEocHS1l/6t+u4gvB2OpkB5GHgWIfLNv69eYUtErXZdhFCZGe1KvjezzQqW002RyM0ZS5k4xdcfK7lWczH8m0J8DwOVEi69T54U+1GvpcCfPCgnahD0YbglVmSAOECXW7j1YY8d26b49psY08cgQ8rmTE2bjLbzxfa+jCpfteP5Gi1lENERYQlOT9l0d0rdfpUUdw1gDMzPnxuGfA1OV/DHFZ4mzs9ojNna53alhtZvdG8QODEbODXfhae1rt/fHKnR9c5axRnEmC5LqMZ6rETX29ZfWBwTDngqXMwSg35AHCRu3ZJ9Xnx63YO/aSYI9jN6Ao/CgWY/alJ6eafFSGheMQ4ctQezSpOb1vLdtbwTCtWOduUGj1t77duvScIZfVJRGCKx21I/hdw59r0sUDXAjGrcHfPLTRxGX7J+1zcfW9PAfenYy6CeK+9zo3fapZCN09vx24Qh4gTDC7KC06dW3S1OVHLrbPEKyEs9nhc7sg8xyIbsChu1EvQd74Roeqz7ciwXHvPk1pkUlrLk5ZdCytUyYxwc4riPZevTSsQ4uBPUpKi4LhwsJMzLEbzs/86cDFjl5zDOGpByX0K6dfeaT+uJdLxc4MxUX5zUAJA+S6RH7007rDv9k6K0WKqpJGTdn3LXgeZs2FIjQzbWCn+i80j8SvwTA5KKXSjJPKi5OWbxt+1VY+IcvnR4KerLarkrBo+EOlXgjGjEUpFScfvtbv8y0nRp5R5FjZYoVdTUfHirYZz7eoOrhuOGZ6QDPCALkOEHZqveSkr/+UnzaO9DuKmVXeDs3rRCLn9rWtWXJet4YJgxsQci0Ydu42hVYZs2zPDzuu+mu45aKwc0Btq3fvgHaVXm4TweJtFvzDyOHG/LD+mz/9jvpOyIiQeJTiXRffaVfnmY7RZFPBv/HeLDEMkOv9xharBzTUHT1ry09XVHO0WyOIkoAKsmfPW8807t5GJkeD0cWMjmjO1nMfzT1wuU+SYYZZdCBKdaNX3TJjutSzBYWkjZ2zzFh3ZsqvR690vMpFmjmrFYIzDQ2L2fd88ET5NsG6mRgM+QW7zDBArkt4P6XxX6w6OnXFieSnUqkIh80Cszs5beTTD/ZvFMsvDYZpxfye9qfhyfFLNky8JMQW8/opIjUPGsTbNo7pVLlD5SDMWGxT4vskdPrkt71TT/q4aN1kgV/XEElEFNEzUwc/WueN3iXInGAr3r1Sfhgg16PcfncBz45fuOJdX2zp0mluN8x6JtrVLL2od9Oyr9Yn5GowOnQfpcVGLN23ZFeSv34alREpCSiSdf7c+70efe6JKLI+GO9kA8Hohbt+WHsVrfwRcdA1N3ieh+YBEkSqVTN5Nw/vUatHwxC4LZgb+YYBcv2eyJj5fy7dc9FbzW+KRoQJSNAvHhvZo0WPx4IUDjng2nE0vf9naw+MSucjRJEIiNWz0LVa/IR+TcuNDMbCnHkP/Lr98uhZGw68nBl7X4SbcDDTTHh8CnyIg5UXEK+kZHaqV/qHfg1jhpULL9TDi/QDlEZ9u/P0mMXbUvp7pAQYOoHdd83/Wttqb3etJEwLlqJeykDT8QvX/vsYtVfz8ybY3S7US7DueadL9XbBcu1Ykk5bfDJ37fRkzlExU3TA7/ehcqLpuGy26nvOa5W9foJIzoeysvvc4CdqvdglhqzOzShbmNOE9AzC1gC7PHh03JwVk9JRvDSFA2afF7VipV3jupV5JBhrAKZMzGv2y9Xnvvj9yNnWTlOEaOEpivrSzw54rMXbPUrzC4LhPr+D0oQJiw/O2n3V2donWKBpfkSK+uWXOjYeJFjgnjzv8HdZxBrhVjREETcaxGs/vdah9gvNCUkpzAC4U9tCGiDMo3fs74fmbTiZ0syn2REhWBDldSYP7dHguW7xZMWdhJef3w9Ravv1SFb/GX8cHpolOyIVaLB4UtG1WsnpvR4oNzgYF5LYO38+pg2YuXLrAJcUEaNRDRH+9MxHG1Zc8HSD4oPsgDF1U9JnK/ec65ZljpOZJ4Ep80Tyvzo2Hde6bOTnBU1CkR+5/a/yhDRAph+41H/SppMfpMIWIRo+RELxtqtTaeqLDYuODhYpwSYfrTh67sbZ+9wR9b2yDVYjC+XN3vMjn2j4VOtIsisYirBJoVWHfrfzx0NZKEccsbASBZWltC0jujd+NsedhHkTjPp2y9z9SnQLJy9Dpi6UEDOPDmvf8IWnosWgOEkGo60FXWbIAoQp6rjZv39xSI99wG3wiNZTUSmS2/XWsy2eDFakKXYY+eUfRyasPJ7S+SpXNFLXdRRHWtrzD9b4oEsF67TcMKvkVQGYy/701UcmLTvmfDZTigQhPKLUaxkDH6sxuFEp0+wbZ4eFV7RHx/60e/oJN19CckTArFxDu4r27/u0qjI4WDt5eW3P3U4fkgBhPkjjVpyYsfZUaoc0IZKXdT/K+JOPv/p44w+6lbN+FwwfJHaLcUMGHh69ZNXnKZy9mNcloghnoG1JfvaAdnVeC9aO0ZRL/hc+/Xn9mBQ+IQHEjAh3Bh6uFLf41dYlX6hFSMaNCreLUss3vx+dsu5UWodrJC5S0VRE8SnuVx9vNHpAojQ+GHK52wqf1/eFHEDYifneK/62Y5fvmXZeMxfhJTNEZwqerVby686NSgyvay1YdvScDtlLaelB32/6fpdLa6wQM4ryJsS5kpI/7tayTct4aV9eOy436Vdn0cojl23+/oRfrpXplxEtiqgq+I+82aV6r0cstw7r/LtCq3/8/fovDrsiG3lkK3jRi7JWz7EPn6zVqaUs/5mb9xamNCEHkG2U3jd+7tYvt6UbD2TBBLPhR6UI6egbj9Xp0z4a24Oxg8RAOeegMnr62h2DvFEJvMBMK296+nNN7//kjer2D4PhqXuG0sgvN14d+93eM70Rkyj7vR5YXakZ/VvVHT2omnnSXwQLEif/6Xxl+rrj76aZo6LSiA/EdVF9uWH5r1+tX+6tYM10/1RQhRRAGAHDF7szPvh+097eTkuk3aAaHJ7U1OcfbjqjQ1X7+GAxhfzmpI3eXbL/22NevoKHcoigCppHktWDO9R8vrGFXCpo5WCcut+eQZ+pv+4eftYwlTRYjEElnbYoHf3bsPYVnr7TThk7G5rw2+mvfzt6+clMRxQk3kB5OM+90rr+qBcSxW9DydQKGYAwpfn5Gh4YvXjfjEuQy/iIHxbqRMsE2+r+T9R6qSFwMRhXSw9SWuSTpUdn/pGiP5bO4nxARTHOc+md9nV6dY8lvxc0OFh5jFP3vQWnF+6/6q2tmm2AkonyovPQW92a9nvCkTtP3WUe2uCj79Z9dppG1tNEGwR3FmrHm/aNe7pyu5qk4EEdDDkURJkhAxB2Iemd+X/O2pgmtclk/OlqEsqavJfebNf0jYoJ0rJg7PWfodT02zn0mbRs4+hUW0K0RzcQSTz+J2qW+v6letFvBOPOxS5KYxfuzhi+aO+5V9J0k8hitdm0dPXZxvd93LlmzLjcXttlC/ZfD1wbMHPd4YFec9EYr0dHLOdRezYtOaFjrZj3c1tOQSjp/7KMkAAIYwpZflx5efIvu966bC4Wb4gEEcoZ91P1Ss19vX6ZIWVu2s0pqA752U9rjJy748czfnMpFydC1LyobKN7hnar/VIccKglISzKQoE9zDNgtwdtPvzh90lJYmTZLL8OM/WhZqLj4JB2tZ5+DDiW2/UOozz6HSjx4cLDS084udqpHhERJg7x/rPHR/du2bu9JTgEEgUmjAIqKCQAsp/SioNmbJ93XLHVzBAiIBEvqtvTdrz1TIM+bQgJys4M85qdtvnkB8uOeHonw86xaFIOzof6Rc0765WKXxUJ6jQDqijwGYLIGyyaGtV1qqqKzMJgmS2yx+vy2gRJ8LNgn8TgiU4C4adYwBDCgroRqhvxDjHJ0DRD5XjNJwmWxduPD95x7nKjFAi8PTICJq8bjzWuvbxucWm2zcA177XkxAR7TKrmhlmUeLdCPHyEzZK4hva5AAAgAElEQVTKopbwJni9Gkw+DharCWlJbhTZn4KO81Yf7KMIsZKmeBCpp/pblrStHf541WeDRUFUQLpdIMUUeoCcoDRuxsr9Hy066uuRJsaJOschWk/LGvx4tcENS4pz6hLiKRBJ3lAIm7G2Z6DNqDm/T7zElyvjFCMD4XkkuGDX0/wiVZwwBIlQGEIgaCeL0cPCS1PKUxLoEwpOY4F8QMGCP7PguRxYyCuDGAYC4QspJZQnAktOIRrUp1Oe8wh8vJcT4ONEEArYQCHrqirAnyZA0XViCCyarqBxhIeha4qTRDoiMhSnJhicQDWJlyGJvKL6ORUcr8tWu9cQTKrKwv8YsBANRbTMy288WG/Mi1XkGcFYtxV0f/yd8go1QJiZsOma0mr0d799ckwuVyPLFANOyUKDkradI9sW6xisOw/szGPcvD++25OKJul8ceLjHCAcizuoQCCewN86ZLBoufArIIEgVjc+gYkiEMOQnbaD8IEYiYE40mzmIIQFag/EVdQ4LgAEs6aBgEIlNBDmmsWOBuUg+HXw1EAgbAmvQ+dpID9nCBBAIVAVLEajrrAwWCLchgJD4MAC8fKSCK/igcBLEKgEDjwMTUVR+GgVPX3zuJ4tO1e1BeeuzN9R6oLMW6gBwgS11UmbvPXV0mknTWWrZfFWOOBF7Xhp69gOFTtUIySpIIXJymLuJD/vOvTO7I27e2fJcXEaiYIGMwvVCRbP1uAC8XQDkXN5AzDzPJg63gog7FuOY79mdxPLQw0EgJI9yzAVl8GxcnQ1ELDNzxvwcQQKLwTS2ngTOEMHMTRQTgsovk4JeEMAoQSCwMPvVcCCcwqyAI/uBpFYUFEWSZcLxIYjEAMB5DSNAY2iCOfB/fTq+vdeeOSZYLnmF3S/5Le8Qg8Qtnv17fYro2ZuOd3XY7IjgtcRrWWee/GBWuMeqhLxbUFfpWV3zBes2TIi02SPSXYpRQXOAsNgYZ4l+A0ieTnOpsKQeUPjiKGqRDc0wjQf2aYVspcZzKYK/FsH4dnPhmFw1DCgG5TTqQ62IKEglKcyeHC6SVeoTnT4eIPzCxzv5ySLQUEknfPxuqZxho/qukZVavAG5XjDECWDchJDoKapRBJEHwOYQXyqIInEp2qix+Asimy1pLj8FkmOAs+L0FUPHJ6Lnncer/OvFqUjvy/shNaFHiDs/GMjUOm92TuWnXIZ9xFRguB3ZVWLMu0Z1K1+3ybAidzu7OR2FGIn535AtACCkR0IFHZAz8wOzsmCdwrsOxa0UwA0Fgg6p2z+BqYZ9jcL6OkOGFn/d7ktJ701YESB+AHddr0MD8D5AZ6tua+/V2V1sAPIYmsPgPNcL4vlzbpeRwsQSMfK9CIwKQnXgIi9XrSZ8eupUefTtAi2BokkHjQpbloz6rGqnYPFbJ9bOd+NdIUeIEyIzFFw7jH3q1/8sn6o2xIbqesGYoiW0rnx/XO71Ip8504ny3ejI/6J72An6qPXnJy/+njyw8RUBFDcKC24zr/RofGA52LJ0n9inQu6TiEBECY0djlq3NI9czZe1Vo6DTNsvIH7LNrZt9vW6fxYXHDuYRR0Z93t8j4/ktV38qZ9w5M0a3GBmBCpZOHpOsUmdWtSbESoDCohAxC2o7XUiTbD5mxc7LInWtI9GqK0THSpGDnlhYcqDAuVDs8tyJi7yjtf/fH1EU1uoUkRIM4s3B8jHx3Vs9ajjUhwYiPmtm53M13IAIQJld0D+fyPE9OWH01tf8aItNhMMor6Lp4c0a35G09H4bdgePLezc4sqHexQ875e6+9t2j9vm5ekyOCbQtH+N3OXm2ajepYgZtapoA9AAqq3sEoJ6QAwgT4yzXaeNyCNdPOmspUz/AbsCopaFk+euWrj1bs3ZSQy8EQ8r1UJqMGOpqKNlN+2THlspeU0g0acFdpWCJqxSvtq70QrNuW/1QZhRxA2DnF3L1p787dcWZQisGDFwxE+tPTXm1Z773XqjimFfaT4TspIps9Jv92bOpvx1Kf4hzZB6sxmjN52LOtunQJEpndner0v/w95ADChM0uTY36Yff8A6nuWh6bHcSdhYZ2ecO7zzR4sYGJHP9fdsj/8t3M2XHPZTw1ftHvH14ksSV52YIIJZk+VDnhh5cfKt83VDx4b+yDkAQIc+Xec9rVa/qqbUOPC44S4ExIdLk8XWvd92WXZnFvFfbDr9uB8BClCe/O37Ng3zU0S9ItsIgUFU2uPe90qxc08u7/5YCQm3eHJECYYFjs86lrj0yZe+JaR0WMQKTfQBniPT7syYYvt00ga3MjvMKUhh1u/rgnadDMNYeG+CKKRSqcDFlJw4sPVnyrdWXrp8G4L3MvyC9kAcI6Z2ma9ujo5btmnnCSoiIvw+5z0bbliix+tV35V6sGibD6n6oUq9y07oez1s84o0fXyPRTxNtlVIrBzsEdKz4ZypsXIQ0Qtu07afvV6T/vP/W0l+31+3XEK67kV59o8vYLpfBNQbug/FPBweKFTF52+IetZ12tFXtR3udyIlF0Xh74dKNXusXg51CRw636J6QBwgSyVqFVP1i4ZfbBTL22n7PBpHOoGiUcGtWtautQGDn/oFS4kIIO4+Zt/CJLiIt2eVQk2ghalTLN6PdI+TdC/QA15AHCdm5WHL026NuNh4akEEeUj5ohuVPRv2XlkT1rRI8v7IdiaymtOOWnA1N3XsGDTpVHnFlGEWSeHfF0nXaP2Mmhf+qsd7fqFfIAYYJmuzcj529besglNDytcLBJAipLvr3vPFO/T1uJ7L1bnXG338POhBae9g+avnLTYDcXYzULJtg8KWqX+uUnjWmQMCzsWRAO4vkfnfzugtb905/WjT8rOooyR3Wr65q33f2lF7/+QMlXKhHmFV64ngANkgd1xv68e87hdKUCz1th1RRUs+s73+3RKGi3Le81KYZnkOs9xi46fb726JSfjlzo6pEdEFSCOMN3dcjjzV97tiQWF7aFKosX8uXGsx8u2Xf2Od0cgSiRh5R2MW1ol4f6Pl9MWlLY2ptfYIYBcl1yLLjlKqDyuzNWLrzglypRIRqyqqJRonXVwA6VexWmq6Vs3bUtDY9PWLp+4mXNVlISTbB7U9GiXNyiVx+p8uLNpNb5Va7CkC8MkBt6kdnkiw6lvDl7zc5/eeXikapGEW24U3s9XOujxyqZJxeWE/b9lBYfueLQt1vOpbVSdCtsICgjuY8O7tL0uScd2BlK1KJ3AnEYIDdJaAul5T9ZuP2bPSl8UzfMkKmGMjb/ofeeq9e+FSGn7iTQf/rvLF7IyuPu5yeu3jjMJUfEmGCGzetCjwaVP+hQP/fMi//0dhZU/cIAuUmSAXfvJHR8f8HmqSlcVDQEE0yqE0/WK/bN4w3iJkQAbqKAHbzrHkCWAG/OvXNWVIAE5PrD/r7xt5s7jf3uAwQ9+w544H759b95wth4AJ6K/z8nELl+n52VpWbfMc+5z66zv01+6IaU/R0rS1UhaCKIokIkIoQrPpSbuWzXsNOZWZV1wsFm6Nr9Uba9Hzxdv31hMiPDACkoCdyiHBaObOq6lG+WH7zQRjNFwa+4kCC63fGiekVQ0v0cIQYxOTidMU2pKuWoyojdsjkPA5xugU8QMF4RxgenM13PVtkbPg1COJ1SmRLGzZD9sJuPjLWEajRA0aMZGiHZjCcUHMkunVASYABiPFmE4ykY3RU1CIXOiIA4ljXAq8Vx4CUoBpG9BpVU0STDZOaTnR6ryWGHZKiI0TPOvNS6xdi2pUzfFTTDSxC76K4VHZ5BbiFqtmD/NgUdp/6699PzHlrMMJlAdQ841QcTzwU006eLYNSHJolNGUzxOVCa/cm4o3IAQxn723XA/PcnIHGMQvQ/4Aj8wYDBsBXIev3JIYvLgWE2AACdMqoeNpMwEiD2VuM/5WVn5aAaHIgggcFYpQScZAZjd+GdSXi4QvSSQQ9X6Fc7xKPZ3g5xYYDcRjKbKE38eUfSmGU7DnR18SaLW9fBixLMJitUnYOiEIiiCN3vDlDCcWyQZ4yFjPUQ2XbWnT7ZbABdA5sCbvUwUPxnZrkBKOzPHKZFShiQskFBrhPQ3UhExxMOuk4D7IiMRMjj8WXzW1GKRJORPqxj/U5xMdjQkmTzn4af/18CYYDcRiOYqbPRj8pT5i2fdsGjxaVpsGmcyawTyaJrAEcEVeY5ndcVH090gyc84QSeMsPqRnQw6tAbgcJdN40C4AAg8sQgeoA8kU0OlIAEbDM29BPC0YDlRBlHIhiBnC6AvYjTOY4jBkepYagMIKwfb8AkI6ILzEXZP2iGzoMnoiDo0Cg1ybLKAXzt0sXWvtKyzFsJhDCUh59bSCAMkL9QCwaS9WnehtdUGucVZcnP87xPh4UxcvIUKhSYZA4aR+HnGUunAIVRPDNi6YAJREFFGSr7ZAuJmz8DKqwxRAQI5W75yDxYWHOa87sgBN6tUQGaKEALBDUHsv9Pyt4k0G7YKGCLdFmEh/eD4xlRHYVhBnS3F46KkTgeBsdfjwthgORy3GSuGScB0Qrw6YBWhdlV14EQPjfIpRDvwWRhgNyDnRau8t2TQBggd0/W4TfdgxIIA+Qe7LRwle+eBMIAuXuyDr/pHpRAGCD3YKeFq3z3JBAGyN2TdfhN96AEwgC5BzstXOW7J4EwQO6erMNvugclEAbIPdhp4SrfPQmEAXL3ZB1+0z0ogTBA7sFOC1f57kkgDJC7J+vwm+5BCYQBcg92WrjKd08CYYDcPVmH33QPSiAMkHuw08JVvnsSCAPk7sk6/KZ7UAJhgNyDnRau8t2TQBggd0/W4TfdgxLINUBSKLWz+84eQNUA6gjcgA6QlzGum/+PMO1mOeSQp91Iqnad2iCQ1AWoLA4HuwOe1+urjKLnLCAKAJEBnpWbcyc8DvDml8L/AqVmCyBmXL/fbQW0IoBGCFHuwX4OSpVZf2WTSzC+u3/2QykVCSGMay9PT64AwpTl4AW9jW7niS7CQwHN0GGiOjhNhEh5xnCWTfPHPtm/eZ2xmTFmtVt/ckaAxQN+N6RYCZkOZzqalIpalRdhU0qFY0CJMymorMjQfQQmBhCRwmdSQErZcaiqmZzPk0QAnMyi8UfcaOCTQDXWNgOSpEE3a1DjDM/VuomWfXkFcm7rcMJDi5c3Iym3ncnuyp9L9RQpHWe9ktt3/N10GzdubMoGJpPJ5DEMg+c4TmefXq/XVrly5QMJCQnJeR3sctKfPHmyfGpqaizP84bb7ZYlSfov8LFR9FZtoDSHzeX/ftU0jYiiqAmCQFkddV0nERERGVWrVj2cGznkCiCHvbTUyNnrfzjrJeWyNLdKJZ4SyCKjYqJQSIAw8xbMgowD8Pr3BJQjCNDTZFOfEXAc4/7gKYxEiaQ2K2rd+Gz7JoPLEZKZm4qzNNcodUxccXzK6sPnGnkIkRSOse6ohmQYmkMVlYerlF436rGK/fOizGykmbP/fO9vNx979YJfKE5lzs+opyw6z0Xp7sz6CdK6QV1bDognxJXbeuY23VVKrfP/2D+ySaMan9cx4TLJBVfVZUpjf1m18/UHm9X7spwZV3KTJ7f1uVW6K1euxD366KPbDh48WJZRGvE8D/bJHkmSMHny5P79+vWbmp93UErNDRs23Lp9+/YaHMfBMAywz7/zsDLYk1NPxmU2ceLEAf/617+mEUICZDB/9eQKIPspLfOvL3evP0dsJdycCp0X4Pcb0P0qzDnMggFm2RyG2dx9svqZiQarJ+XqRz0e63F/jLDzPkKcd6p0zu9XKI37ZKt71sJdJx51ixJ0kWHOD1lTEeGlSue6FWc939T+Wl4oNZmSLvkz/ZXPN54ec4W3y27GyUMBk6oj1peG5kX0H8d1b96joAHCQhIkX9Uaj5/z07T27R+b9tB98qw7DRZsBl2XhYZTv1ky7YmWDac/Ui1xVlyQg/0wJa5ateqJY8eOFWPAYArMlE8QBHi9XkybNu31l19+eTKb2XIbY4S1gzHEbNy4seHDDz+8KQdwmlYwXHYMFKqqBsj2YmNj3Tt37qxWunTpM7nRs1wB5DClpXrN+HPPccMWnUF9IGYJBCIkToChKgG6y/w8oqHAZqShYTHHxg/bVnumAgKj5m14Bv/7DScpjZ+0zfPjwn3nGnpkGZ5AVg0WAJFuA09VL7VoUDNLzxKEeHNbP6aoG084+3685uTki0I0/Iye2jBg0ggStUw0iXKtGNKlfrfqhKTntsw7pbu+jrLP2Xjq7QUbj71Yu3rVP4e1K/V0JUIu/1XeZEptX+/PHLH093UvVU2I2PZG9wd63Q8k50WGd6rbjb+zeqamploeeuih3fv377+PKRwDBlO+nOfrr79+sXfv3jPyUm5O2p49e34/e/bsbkyh2cifA5T8lJWTh4GXgZiBjVlg/fr1m/HFF1+8mFsTMFcAOU1pkV7fHtp5TLeXSDe8oDIHQ2NGEuMT5wKsaPl5bJoTJY3Uy292aPF6izgsz4sis/cx8+LjzcnfLzlwpnWGaIKbIwEaTrPBIcZHGEDmvdLM0SsvMwgrd+bRi/0+WXvq40tyvN0l8TB0AlkTkaBlolmUZ8U7XRr2qEzItfy0+VZ5WGdtUVD24x/WfXPEHdHMJhPniCdrdn0yDiv/ahRmsRWHzN+79kKGp7LVlXzqje5PvFY7gV+T1/bmpR1sBqlVq9a+ffv2VWDKx54cU4sp4Oeff/56v379pjE7OrfrSTbbHDt2rFSzZs32pqWlRdxsuuWlfrdLy+pqtVr9S5YseaRVq1YbAiyWhJk8f/3kSrPPUBr54szd2/70yxUziAbOYoWhsu0dkTGIB1YabOxmexo3j/80wGaebUdmM2rq2aYYgGglA23ijOXvdKzdqyIhqXeq7M2/X6A0etKWpG8W7j3+RJpghsbqxVY5Hh9iVIpnalb4oW8TW++8Ksw3Ry/1/vD3wxPPCdERPtkMwokQVSBGyUDLWO3nMV0aPnsn8ycvbTlBqbzhvNpzwqI/hmeaSpQkigt9mpX6uEvd+DG3C8N8hlLTMS+q9/1i1WouOtFBrl31PF63wuw+zUu+XZCz200zCOtIuUaNGn8eOHCg7I3rD/Z3DkCYiZWX9rO0n3322etDhgyZqCgK41sNZM9Zh+S1rBvT37iWadCgwe4tW7Y0I3mwKHINkP5frll/TBWqZ1kcyNIliMQCaBx0Q4FoEuFWveAEHjIvBIj/nc5MRMbGI8tDofopTCYzRKJD86eBcBp4UUC8mnb1k8cb9OiQIK7JjxAuUhozfkvK7MX7zrbNkKzwMVJmDjBrOiIVL7rULD339cZRvfMayvnrU87nR6/c+9kVU6xV5Uxgu5kypYhSrqFljPHrwM4NutXNw2bCndrGgD7wx6OLtl7ytvRSE2y8gdJi1u73+jTs+gBw+lYj3QFKo776/cgnC05c6+0zJ0D0aCgtqFcmvFStSQtCcmVf36let/o9OTnZ9tBDD+05cODAfYFBj5F1U/ofZZ4+fforffv2ZTNIrh9KqVSnTp3de/bsuT+nPFmWoSjZO+o53924lmCAZGYT+81kMgXWPzcCKicPy882D/x+P1sfvfryyy9PyXXFrhMe3zE92+b999KN0w453VXTYHb4YLFJsAuyIOqq4tQ5SVB1zqAGKKGaDj8lkhAZzZ9Jykjwc3b4YYLA/kdUGEYWzKIBr/MaHqtYbOVbbcr1qJuP2YNVmq1BJm+99t2ifWdbZ4o2+HgJBuEg6z5EKx50ql1q3tCG0X0SCTu+yf0z47T3hXdX7Z6UJMdYDWIJKIBMdUQpqWgeg1+HdK5fYABh5sWKLDR4e8neeWdUU0lqcLDygMmVkvZq+6ZjnimNr27mz2VrgZVO1Pnkx81f7VHE6ll8FIhHQkneZ/RrWnzgo/dbpwUrXFxKSoq9VatWu28HkC+//PLll1566YvcSxvYsGFDk+7duy9MSkoqarfbXYZhcLquC7quB3ZubTabKyMjI8rv93MMOGzNw9YoObu9LE18fHxmVlaWXZIkRRRFRdM0lp9tQVNFUUxFihS5fPDgwZoOhyNPpnGuZhDW2AuZNNrjCJAsC8ySUgCZfW8HdMUHoplg6IHlLKgbsKUBxaatT5mw9fjl2obsgOZnLOdcYLc3SjAgp55LG9r5wUGvlMCs/C4qz1CaMGnrte8X7jv74K0A8lTNEvOHNY7tnVeAfHXa2+e9Vbs/TZJj7MEGCDNfZ249/943e86/kGmJtars0IXqkLJcaF42et3Qxyt2anDTeocNWHOOpA/8au3OIU5LbESWYQbxmxDPKahty1jzUfeGXfNjsuZGqYMBELaLdfr06cS4uDi3y+UimqZJPM8z5fbpum5IkiR+/vnn/T/88MPhObMKq2vOLFO3bt0DCxYseMJmszFgaGydxEw1s9nsYfkFQeBZmcWLF7/IBpfcro0Cs1duhJLXNKwSM9LRZuyCjdOvEnNxWKOg+1jXCyBERKTuRosobu3QTpXY7JHvA66zlBadsPXaD4v3nX3gdgB5p3Fsn7wymM845e397urADPJfAGkRS38b3KnBMwVlYu2ktOLQWRu/3++T62SZHVANFYbqRxHJCocrOXlsz+adOjvIxhv7gEXAGvvzgblbLmS08Jsd8OoyCLUggiiIcp44O+a5x17sGIO1uVmE5rVvgwGQG+twswLnnIBPnjz5tddee+3fLC0zr9gMwmYOtotWpUqVo/v376/FtjAL+hwoKADZRanly01Xvvrx8KVn0ngT0VlEI90AxyId6QaK61meYQ9Vee2F8qav8zt7MEGxGeTTrdfmLdp3tsXdAwhWDO5Uv2tBAITFQ9x6Dq9P+mX9yGumCLtLlKFzRiD8WozkAJd0Hr2alvl3n3rFRlS64Xxji0IrvTZ7zS9ndXs5PydBJSIoZ4Wk+2D3XFK61Ck7e1jTMgML+qyGyfxOAJk+fXq/vn37Ts8r8P4qPTNDJ06cOHDw4MHjA4GDrh/+5axPqlevfmjfvn21mPdBbrdvc1u/oADk52u00djl+2YeU8XKmZwAHRx4KgRMB7PmQ70Y4fDHT1VqU4OQi7mt6K3S5QYg+TGx2Azy3urdn16VYxy3MLFWDulc/+mCAAiLODv8x2O/bEvxNko3KPySCUQUwbOQhR4DkaoHVRy+nUM7132+jYQjOTMCC+P81oLdP+69ptf2cBJ0wQQ/J4KoCqI5LyqZlCPvdWncsaVMjv4d+d4q7/8IIGTixImDGEDYrMFAkrODxv5ds2bNQ3/88UfTqKiojIJub4EDZD+l8TPWn/9g2ZEr3a9Qs5lYrWDxxgVIsBsKilBnaq8WVT/tWcE0Ka9rg5sbHyyAsDXIqFW7JwYbID+m0SZD5m9ZnCrHFsnSFFCRHUqaIfISdJ8/YDJFKNdSX25de9IjFaXxOQtvdkD4xX7viO+3HnwxmZijfLINPiYcww8HryNWSfW8XL/CqEdrJkwq6MU6Awjbxdq/f3/5nBH8pl2sAp9B2HsmTpz4xsCBAyeyv5lZFYjcdX33rF69evu2bdvWhORxMyY3YCpQgLDF4wGg+pDP//gh3RpfNs0QAiGW/IoGmQqIpV6UF69te//5pk83I3l3Iry5QewAc9LWa/P/ysTKzwxyNwByiFLbwl2pI7/adXZQCm/nOJlnbpbwuTkQKiDCZgbNSodZyUDryjG/vvZIyf9v52xFJq3//vztM46o5mouSxSUwPkSBW/4EKs50SpW/G1Yh9rPVyMkKTeKkNs0/yuAfPzxx0OHDRs2Lmf7lgEkZ5Fep06dg8uXL29UpEgRX14W4Llpc4EChG27/nvzxS9/OXC1fYZkgRsc/LqBCJsdWoYLcbrTPbBttUHVyllmFkTQyGyApC1YtO9M84LexcqZQXSYAyOVCQai/dfQPIauGtypfpe/a2Jtp7TMW99unH8ScfUu+igEswzND0hiNFSfDlmg4DUvbFRBrP/y2U9faN6htY3sy+lUdg4y8/ezk+YfzeiZZouHn53HUj8EniDC50Ss89KVcc890rtjDFmRG0XIbZrrJtbeAwcOlLubM8inn346eODAgQET6+YnByAJCQkFHmuxQAGy1k9rjJl/cP6hLFLRK8tws7DEAg/BryAKBiqYldMjO9du3cpETuW2Q/4qXW4A8mbj2Ofz6sJy4wwSLIBMPa/3//cvm4YncxEJPnM0NJ6HqrO4zhJ4TgRUHSJVYDHYwvti1rMNik1+v0nZ4TfKY+5F2mn4st1fXpRioxSTCFCVhVKH2edCpDdd61avwsxBjeIH5XUX769k/g8FyIHly5c3/kcD5Cil9kV/+ofOWHlwcKY1VvKZRXipBlHiwGWloTh1+zrVLjvrX/WLvJFXhb1dh10HyMJF+840u90MUvAAwerBnep1/jszyClKI0auPL7095MpLb2cDao1El7C1h85sWpFwOAhwoAJbljcl3G/Wd80vE+Tzi0JuZojjx2Ulhi24PjyHWl6NY/ZDp05Dxo6BL8XNt2HCrLn5MTujdo2NJETBTEgsTL+qQD5+eefGyUmJubpQDg3MimwGeQPhd7//vyjc06k0RpOkw1uiYMhMFdxPxyqE5U4197hTzfp+6iV7MxNxXKThgFk8pa0hQv231sAWZ5JGwxfsG3hed1cQuclZBkcdNkB8Bwg6IBXBcRIEFWFCCfs/izE+V2Xn29Zd+Kb98uTcuzsE5Q6vvvTO3rW5mMvJgl2iyqYwWkaRKrDxBuwZl1UBrau9na7StGf59Uf7XbyDwMkN5p5UxrmbDdvn3fMN7/vGkAdsWIG5ZBJScBHi9c8iFUz3M/WKvnv/g1LfPB3d65ufDVb80zJBsgt1yCdapVYMKRRbK+8zlh/bWL9vRmEKfXMzVc/+H7v6RezzNGyRgGFilDNdkDmwSuZ0BkwTPFQmX8RccFs+BGhGqgda9r4XqcKj+fMXux84BcNDT6au3P6AZepmmsKz+sAABUFSURBVE+OhMDMNLaxzhuwaOloUITfNqJ9jS71CbmQj679ryxhgORDikcpTXzpm61rTvqESn7eBFWU4FT8MMkSTD4PyvKuM5/0bPZgSzM5m4/ib5slmAB5b9WuCUlybMTNa5AW0cbvb3Zu0LkWIfnac99EacV3v90577Ai1szkLNk+RWYrvEyxeQpZywDY/QpTPBR2Y09kMwKF6NNQEt7L77Wv1bNzAvmPcyc7S/lszbHJS4+6urvk+Owrz8SAn6iwSRoi1NTM4V2a9n0hAgv+zqFsTidcB8g+5s37D1qk/3PXIGz2+OVkWv+PV+wc54osIbkVFbLFCq9PhZUyF3GP+4mqJRf1ah73Yt18XJr/K0BlA+TaggX7b3OSXqvkwoGNYnrm1Zs32xfr1gBpHkPXvN2pfuf8uJQzWa08bQyY8tuWYalydISTiiDgQSQJPk0HT/2oX6qI89yZUxYXMQteXgQnMTtVgOZTUFTN9D5d2v51uzblB9y4C/j9FU/nMT8fmXmFxtqNADcADzfxQhANCLoHT1Yp+uOYRkWeKwgX/TBA8jjEb6W09Lvfr51zkNqbXNHkAGODbLHA8Plg93tQBtrhkd0b9GhvJXvzWPQdk2cDJH3Bgv2nW2SKVvgEEToEyIY/4M37dPXS819sEtEzr4dl0076+45bvWd8khRp14kAAxQ8ZyBaycQDMVg38ql6T1UlJO2OFbwpARvtx626sHzDWWfDNMpB5WQIEnPr9sIk84gkKvo/VWHwj0v39DrtEapkcRLn5wTwsgmqn73fhRp85o5xzzbq2sD8fy7tBykt0n/2rnWnvBGVXJoIxsfi4xSohg+SSFCGZF78qkedJgVx9hQGSB56nV1PXXfKP+DzFZuHXBJtsU7RCrMlGprPDcGbiaLE6+pyf/kZvZsUeTcvd81zWwUGkM+2pi+Zv/t0E6/djkw2ClsdEFUNEU4XutxfesFzLazMITLXdC9/UCocPIt/TVjx59gUzmKmnBK4QalxBqyedLSJNW0Y1KF2x5s9bHNT55VO2viNBYeXXaSOOM3wASKBonOQoSGCelGrmG1/v7Zlu287cKn7txsv/MtjKWLXeYIsrw+y5IADFKaMS8qr7eqPHHIfJuQs1tkB7Q+Hs0Z8sWrf6+mWEhavZIOiuiEIzD1URVFkel6qlzhyWLXiE3JTzztt8z74UKt9B3NMLPzXfZCgnKTf4Rzkn2lisSufby8+sHTrZXdDdprrk8wwfBpkQhFjZCFRTz/1zhMP9u1Q/P9s5r/bQf+1SN+cuvDHQ+ebJ1MCwx4Jr0YgGkC8aqBFEdPa759IbJ2X01W2XT1jc/L4+bsv9c0QbeBEAyrRGcEWbL5MPFncsWLgE1WeyesahJlXs7Yljftmr/ONFDEKlMsC2O1MIsFhqLBlXbj2epeW79Qtih8ue1DhowV75p50CfcpIg9NkCHzDlBFgaQ50aS4efvY9mWfqEFIco48/vDTmiO+3jD7mBFfLUNyQDLx8HqyYBIIorRMNIrFT0M71O6T37s3N65BHny41d6D+68fFIYBcmuVZlc+fzzn7D1+2Y6PrpmK2vyOKBiSGcjywMFOfz1JnofLRf7yyiOVe9cgpMBPOFmtzlEaNfeob8L0NTueS4LAITIOPoWHmZfh8PtQhmYcG9+zTpsmZnIut8DcSGnJT+bt+mFfstbEZ4qExkwhyPARGQ7fNTxfLebrHi0TXstrm/ZQWurNr/bM/1OLaZAm2+Dn3OA5HZJCEa17UMXi3fZuz3pPNSXk8iZK7d9tvDRzxYFLj1+TLSZNtkMgJigeLyyCgXj16qUPnmrQt0ucsDynXcx1Zeba858uOpTaM0VwSJxJCpCXCRwPs5qFIkrSxWE9Hny5VhRW5dXkvFF2zMQKAyQX2sQUacz8TXMPuq2NU/nogD0N5oVqaIjyZaCUknTs3Wdb9OsQRdblorh8JWEm3vFMPD70m9++yrDHRGUEuBVt4AwBks+HeD3D2btF2bGdqsVNys05ALuLMO0i+nzx0/p3Uw1LompyQNEY+50FFDIifSl4p3WFAc0qcnm6scfquekU+n2ydMfIrKhiMWkcDz91QZR5iJk+JOhZ7heaV/iwc43I8ayezGV7ThK6Tli8bvQlc1z5DPZ+dr1Z1yFyBhJoRtaTJcUFQ1rXePXGLezFKbTlyIWbf0iWIhMy/RSi1Q7dbwTWZA5vJjrVKT+vf9Po18vfMPPkVfBhgORCYmz/feYVtfunP2/58DJiEtOFCIBKgCTDCj8iXUnuNiVsi99vV+blgjz3uFXVtlBafvTX6xcf1fnq1wQLNF6C4ieQDBOieQPxNPN036fqvlMvCj/VvYO35y8Kvf//tXct0FVVZ/rb53XPvTfvdxMCKlB5Q3gIhSITAxTwAVP6AEekTmUcH1jHAApSUEdFHhZWKS12CqWIhYVWihJiteKioKKIAkFIiKPhlcSEJNz3Pc8967+YWakjJhfpHe9a566Vx0rOOvs/3z7f3v/e+/+/f+mWQy+d06TedC7hN0hUUYQsiJBNA92Zz7/6X0rGdYyJ6gJcqOU8d2ll0443Pj4/xvCoCAs2olyDLDCkRHT0lY2TT84acWOpyj5uvx8tvJc8t/e5tyOeCT53DnSDQ6Sce1PHt+wALxEa9y/76aQfdgxGfJ/znCV/fm/3hy3WiAvwwBLdsHQON5OQYtnoKUdOPfXjQZPHpbITXbH7y67533OQqsS6WBTuXl5evuoSsVhHKioqxnxjQk0oVGLxrqoX99fr41u4B7YnC1EdEGURLNiC7pLWVH7joHtHFmFnPAvky+k0OnjbtK9u+aYDx2dHsgrcYUmCzkVIzAPZ5FANHcWpds33x/ZeP6m7vE0AWr5oE607PmjFqF9s/9sTrZ78606HKGrQS9n+F0dtI4oUI4Cxhd73n57Wd1K8kj+7/HzsIy8ef/GU5c2LmAGIHhkGYxCiEWQZUWtSr9zdT068ZkbHwYQGoTVHGx5atff4El96sarZEkRJjZ2UpwQa9O9f7Xlx7k0D53bcTaOZaucn/od/VbH/AZ+7IFOTSH2GQRXdkE1QhmJk3vjeC+8flPareNZlX3SxysrKPjzqEOTSr+vWc+YtP39p/8bP5OxsU5QAxQ1N57T9DhfTMKx7bu1dN2TNKgBOCYBMm7+Uq047+hrA3AAo2qi9hVTACEWgqG40dcUV+qJlO9t46eMvHNj+qeXOCbopgUgGt+yYNJFkyjHB3gwhGBzdp2D/TUNz137Lg2MCYJHlZzV8+/X3zs56t6bp+lYuF7dxA0pGJsJRC7ZuQZQkeM0grnJFzt8xpv+yB65J/WU8aZ20NnjuvTPLthy9cF+zlAbdCEBR6fxDhRwJohvzn7p/yvBl/14kb/jifQ9G+TX3Pr93T7Xu7RGSU0FZNak2R06kue3nNw+fP/tqmfL5/05+8K+c91v8+7c2V2veYSElHYyJYCSabIrI0NtQmm9XLvhBv9lDGWu+nAHp/+skPWlmkAOc56/f/dGzr9ZFpvrUDNgig2GakCQVphGBS7KQ5xasrLDvpBuRiCCYqksUNKaLliTK0AQm6JGw4BW46RIkO6zbKWky9AJFP3v3jyb/bKALp+Id3Ug2Z8Vbzc/vrDo96bykQpNo5DegqCnQgzZSU9NhhwMQ9Vbku6J1Xhg+mUHgouxq08yUAHfl20qW6LNsSOkSIkE/BBp1OYOoacgXIhiWhz3zbhlx66g48ysorH3Bpr3bTpjZ17UIKphkwKYEMtuDTDuMASmB/YtvHTmrlP3fKAM6N/nlm7VbX65umhh050MzODItHQO85vEnfjj4xu98SWRCTA5o39nlO2raZjXablVQXNBJwlP0IIdFkR+qq1ty27g5P0rHG5dzsv4NJcg3Y5uXpvATfpQ+uvmNZ89JGT2i3ixEOakZihQlEROl5jAgWzq8hgGRmzBkDmZzyCRYFRMG5WACh2xzCDSt0PapFUUvOXjs0X+bPD0FqLucXZbXOR+4+qVjv63yCaOadAr6c4ELImzOwW0bEudQRA6Z5jIrDA4NgsigRW3IajoM5kaEAbaHg1sGhIiNdHCkalH0kCPHF936nZmTU9jReEZd0nv6fZ3x05U79iwMZ/UobtQsaMyEW02BEJaQZwbCc27o8djUvqm//jKBOFL72NqCGY9tfe3pZk9xkQUZOZovPGtU3w0zSjyPdMxTb7eLNhr+FML4+X945/kmNTubnpQrauw03mWEkB1s0KcNKdpePqbXfZdzsk4EmTBhwqHDhw/3btehak9/pZ+Uk37nnXde0Zx0erYVK1YsWLBgwXL6vaNgHdkwYMCAE0eOHBnSFTHqePqPro0rmvcE59lr9tb/uvJ4/bTzTFI0xQNLot0rAaLNSNQHFqyLhCDVCQboJBJELlUs4Y3DYvR3OyYITV+K5IpFq/YTLny85LaxU8cqOBmPC9PxgV/W+dDFv9u7Pewu7FnfGoE7IwdR24z5dqTqaFjmxZwLmJAlGwKz4FU8iEYMaKYESxbBFQESM5GmG0gNB1EsmdX3TB25+NZC9qd4waXF+ZIdJ7bvqw+MCykq0xUXae3F6kUoPhtFzN+w6ifDJ34vlR271L0p/3zp9gMb931mTxBdKSgwztf95+wbZk9NZSSf+aUfEht/vOLTrW+eahsZcHtgkBtMumSCicxwK65VQjXLflI6ZSxjn8T7TJxzb0lJyZGqqqqelPpKMjzt+rekV7V27doH5s6dG1MfuZKf1atXP1heXv4Mxa61qzjS72TD4MGDvxmL9Jcb+Q3zt73zfGtKQUFYZLBcFENELrAAlx2LtQNs+kZapEJM5ZASgUhqVLZsUJkEi1ngxAz60DWaGTsHGKpEPlp2x8gpw79mKm6lxget23b4NyeatNEBKQ0hyQVbEcBF7WK7svtiQpJlwtLCsYo7MS1YQQGnlFcT8Ng6ilhUL7D8H98+fvgzZdeqf4w3noseb1czL53/56oXGl3Z2W26H4zssCx4TBNZIQ3f+3b+K49OLv7xV0Ubxxbrx88/uHbP0SchKcrowpTKpbcMmd37K9YQnHPXulrt/jW7353f5s3L9ZH7CwGqyJBmhJB6/vSFh24e8ciYvpm/i3e2Ju3ccePGfXCsqioWrIjPlRXpRSWlw/Xr1192+YOvItSaNWtiOentiiYdVRRJF6uysvK7ubm5gStJyrhmEDoJ3rinfuXmI413hzMLJZ8RhE11QWKjE6BYlKwTkyyOEYTcGxqsaY1Cbo7EqYaEDfvzGYTII3AbLiYiI3oBfbmv5hd3jy8bwti5r/uQrwX5kF376pfvq6kf2Sx60nXVDUsyoXELIaruw2XIECAJHJoVRKpHAQ9HIJGqoeSG7G8NjCx0H7itdMATU3Lx9uXMaLTTt+lAyxO/OdRw33k1A1BtiCS5qkdibluhpTUsmDq6fFYR29rZ877FeY9HNr6xzxcKp/1s2oT/GFOs/rGzzYw3A3zA8pcObvrALw4LuTMQJTUQmyONUoejF6ySlOiBJf96/fR4c9aJIOPHj3/36OEj11o2hdVfrA9C8p40g2zYsCGm7n4l5XfoXhRqMm/evBVERJIRpdx0kiKltktKSqoOHjw44h9R/atLLhb5wq+14rqntuz9r1oxt59fTYVGtUckGzbViKCzAkuI6V6JVCeEMhJIoJpGbCLE3+URE4s4bJFkrQ247SiyjACutoPVT90ztWxoJ5L/nb1M7f8n92bHoYa7dn/UOP1chPVsjRqpuuyGqWbAYgoE04YNDaZqAmYAOdxAWjTkyxPE/76p5Npd00fmrf066oQHgnzQM7s+2vx2yDW4ATIkF4vlxighH9L1gH94t6wPF/1g6O1dmTFJPO3BindeqG9q6b7ojpsoxKRTuSRSbNz4bstjW97/5J4LrnTJFFjsZF2BgDwZkJtqI8vuuHFGvxz8pTOydcScVAv79ul7sqamupvABFi0pusgNE3So3PmzKE1CCkYXpkCHwBWrlz50Pz585/uKBpHswgRpX///iQcNzD22sVRPqMr71KXCEKzx843ax6vOFQzrcWVnREQlBSbAp4k22aWpQu00rZUhUEURIumChu2aNpUf03gpg0u2CanWgkCEzmzqJ4IFygMTzeg+cx8hYeuUnj1opnT7+zj/eqaGF15qPZryD3ZAxR/eBq3HD15duKZJn+vZl0sCmuWwg1Lg6ibhmqwLK8U7OV1nxl+VdFfx/bP+IMbOPN1zm9oQNle0zZjw1/2L6oX0go0NVXRDAMurkczLa01i0VbJl4/ZNs/D+r2bFddt8ozTVOaWn1X3T6o12+7+uK97uOjHtuyZ/NnXC4QRJFxgXHbsOFhtu7VfMbEAT1evWvCwHvjOcylRfp3R4+prq2tLeSk6U/nOcLFU376uW7durgForvSp6tWrVqwcOHC5TRLtbtz7Qonw4YNO1xZWTk2Ly/vilf96hJB6AH+9mnbuKjodtmyy9Al0uE1GRcsmdmcThtg2FIsuUG0YvUOYAqmyUTTkLlpUy1DnakSXUexfwLAZVqzM1OwGJgkmJY3GuT/1C1nf1c7vyugdiAK6Zu6m4GUpjCK/H4UkmPoVhEUBITz09CYBgSDQChen/xSdtRwnlNz+rNRAle4mpbp1wyokgHLY0RtywqyzJ4578UTz0VuRh3g6iqh2u16tcEoDTApTWJmxCVKpm5Yqq3paprb7U8XDf/wbPn9eCRKeVNTyqNr1y6tb2jMM3RNkhTF+FwoWnK5XMbMmTOfKysrey2e/unsWnr2ioqKm1955ZVpkUjEJYoiRWdTqUJmWZbcp0+f6ocffngV+wfE/HWZIJ9XNCWbOi060tkDO/93EIgXgXhFp+O9/6Wu7zJBrlSDzn0cBJIJAYcgydRbjq0JR8AhSMIhdxpMJgQcgiRTbzm2JhwBhyAJh9xpMJkQcAiSTL3l2JpwBByCJBxyp8FkQsAhSDL1lmNrwhFwCJJwyJ0GkwkBhyDJ1FuOrQlHwCFIwiF3GkwmBByCJFNvObYmHAGHIAmH3GkwmRBwCJJMveXYmnAEHIIkHHKnwWRCwCFIMvWWY2vCEXAIknDInQaTCQGHIMnUW46tCUfAIUjCIXcaTCYEHIIkU285tiYcAYcgCYfcaTCZEHAIkky95diacAQcgiQccqfBZELAIUgy9ZZja8IR+B+89p8wgMvKMAAAAABJRU5ErkJggg==";
        //#endregion
        
        //#region init stylesheet common data
        
        //#region init data and size
        const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
        const d = new Date();
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet(monthNames[Number(this.selectedMonth)-1] );
        // Init Column Size 
        const A = worksheet.getColumn('A');
        const B = worksheet.getColumn('B'); 
        const C = worksheet.getColumn('C'); 
        const D = worksheet.getColumn('D'); 
        const E = worksheet.getColumn('E'); 
        const F = worksheet.getColumn('F'); 
        const G = worksheet.getColumn('G'); 
        A.width = 60;
        B.width = 20;
        C.width = 40;
        D.width = 40;
        E.width = 40;
        F.width = 40;
        G.width = 15;
        //#endregion
        
        //#endregion  
        
        //#region Header
        
        //#region insert logo
        //worksheet.addImage(logo, 'A1:B4');
        worksheet.mergeCells('A1:C4');
        var logo = workbook.addImage({
          base64: myBase64Image,
          extension: 'png',
        });
        worksheet.addImage(logo, {
          tl: { col: 1, row: 0 },    
          ext: { width: 90, height: 80 },
          editAs: 'undefined' 
        });
        //#endregion
        
        //#region inidividual activity form
        worksheet.mergeCells('D1:F4');
        worksheet.getCell('D1:F4').value = "INDIVIDUAL ACTIVITY FORM";
        worksheet.getCell('D1:F4').font = {
          name: 'Arial',
          color: { argb: 'FF000000' },
          family: 1,
          size: 22,
          // italic: true
        };
        worksheet.getCell('D1:F4').alignment = {
          vertical: 'middle',
          horizontal: 'center',
        }
        //#endregion
        worksheet.getRow(5).height=40;
        worksheet.getRow(6).height=40;
        //#region  Project
        worksheet.mergeCells('A5:B5');
        worksheet.getCell('A5:B5').value = "   Project";
        worksheet.getCell('A5:B5').font = {
          name: 'Arial',
          color: { argb: 'FF000000' },
          family: 4,
          bold:true,
          size: 11,
        };
        worksheet.getCell('A5:B5').alignment = {
          vertical: 'middle',
          horizontal: 'left',
        }
        worksheet.getCell('A5:B5').fill = {
          type: 'pattern',
          pattern:'solid',
          fgColor:{argb:'FFedece6'},
        };
        worksheet.getCell("C5").value=projectName;
        worksheet.getCell('C5').font = {
          name: 'Arial',
          color: { argb: 'FF000000' },
          family: 4,
          bold:true,
          size: 11,
        };
        worksheet.getCell('C5').alignment = {
          vertical: 'middle',
          horizontal: 'left',
        }
        
        //#endregion
        
        //#region  Month
        worksheet.mergeCells('A6:B6');
        worksheet.getCell('A6:B6').value = "   Month";
        worksheet.getCell('A6:B6').font = {
          name: 'Arial',
          color: { argb: 'FF000000' },
          family: 2,
          bold:true,
          
          size: 11,
          // italic: true
        };
        worksheet.getCell('A6:B6').alignment = {
          vertical: 'middle',
          horizontal: 'left',//center
        }
        worksheet.getCell('A6:B6').fill = {
          type: 'pattern',
          pattern:'solid',
          fgColor:{argb:'FFedece6'},
          // bgColor:{argb:'FFFFFFFF'}
        };
        worksheet.getCell("C6").value=this.selectedYear +" - "+Number(this.selectedMonth);
        worksheet.getCell('C6').alignment = {
          vertical: 'middle',
          horizontal: 'left',//center
        }
        worksheet.getCell('C6').font = {
          name: 'Arial',
          color: { argb: 'FF000000' },
          family: 2,
          bold:true,
          
          size: 11,
          // italic: true
        };
        
        //#endregion
        
        //#region  Customer Name
        worksheet.mergeCells('D5:E5');
        
        worksheet.getCell('D5:E5').value = "  Customer Name";
        worksheet.getCell('D5:E5').font = {
          name: 'Arial',
          color: { argb: 'FF000000' },
          family: 2,
          bold:true,
          size: 11,
        };
        worksheet.getCell('D5:E5').alignment = {
          vertical: 'middle',
          horizontal: 'left',//center
        }
        worksheet.getCell('D5:E5').fill = {
          type: 'pattern',
          pattern:'solid',
          fgColor:{argb:'FFedece6'},
        };
        worksheet.getCell("F5").value="";
        worksheet.getCell('F5').font = {
          name: 'Arial',
          color: { argb: 'FF000000' },
          family: 2,
          bold:true,
          size: 11,
        };
        
        //#endregion
        
        //#region  Consultant Name
        worksheet.mergeCells('D6:E6');
        
        worksheet.getCell('D6:E6').value = "  Consultant Name";
        worksheet.getCell('D6:E6').font = {
          name: 'Arial',
          color: { argb: 'FF000000' },
          family: 2,
          bold:true,
          size: 11,
        };
        worksheet.getCell('D6:E6').alignment = {
          vertical: 'middle',
          horizontal: 'left',//center
        }
        worksheet.getCell('D6:E6').fill = {
          type: 'pattern',
          pattern:'solid',
          fgColor:{argb:'FFedece6'},
        };
        worksheet.getCell("F6").value=this.capitalizeFirstLetter(employee.firstname +"  "+ employee.lastname);
        worksheet.getCell('F6').alignment = {
          vertical: 'middle',
          horizontal: 'left',//center
        }
        worksheet.getCell('F6').font = {
          name: 'Arial',
          color: { argb: 'FF000000' },
          family: 2,
          bold:true,
          size: 11,
        };
        
        //#endregion
        
        //#endregion
        
        //#region Init Table Header
        
        worksheet.getRow(8).height=40;
        //#region  Date Column
        worksheet.getCell('A8').value = "Date";
        worksheet.getCell('A8').font = {
          name: 'Arial',
          color: { argb: 'FF000000' },
          family: 2,
          bold:true,
          size: 11,
        };
        worksheet.getCell('A8').alignment = {
          vertical: 'middle',
          horizontal: 'center',//center
        }
        worksheet.getCell('A8').fill = {
          type: 'pattern',
          pattern:'solid',
          fgColor:{argb:'FFedece6'},
        };
        //#endregion
        
        
        //#region  Site Column
        worksheet.getCell('B8').value = "Site";
        worksheet.getCell('B8').font = {
          name: 'Arial',
          color: { argb: 'FF000000' },
          family: 2,
          bold:true,
          size: 11,
        };
        worksheet.getCell('B8').alignment = {
          vertical: 'middle',
          horizontal: 'center',//center
        }
        worksheet.getCell('B8').fill = {
          type: 'pattern',
          pattern:'solid',
          fgColor:{argb:'FFedece6'},
        };
        //#endregion
        
        
        //#region  Location Column
        worksheet.getCell('C8').value = "Location";
        worksheet.getCell('C8').font = {
          name: 'Arial',
          color: { argb: 'FF000000' },
          family: 2,
          bold:true,
          size: 11,
        };
        worksheet.getCell('C8').alignment = {
          vertical: 'middle',
          horizontal: 'center',//center
        }
        worksheet.getCell('C8').fill = {
          type: 'pattern',
          pattern:'solid',
          fgColor:{argb:'FFedece6'},
        };
        //#endregion
        
        //#region  Activity Column
        worksheet.mergeCells('D8:E8');
        
        worksheet.getCell('D8:E8').value = "Activity";
        worksheet.getCell('D8:E8').font = {
          name: 'Arial',
          color: { argb: 'FF000000' },
          family: 2,
          bold:true,
          size: 11,
        };
        worksheet.getCell('D8:E8').alignment = {
          vertical: 'middle',
          horizontal: 'center',//center
        }
        worksheet.getCell('D8:E8').fill = {
          type: 'pattern',
          pattern:'solid',
          fgColor:{argb:'FFedece6'},
        };
        //#endregion
        
        //#region  Hours Column
        worksheet.getCell('F8').value = "Hours";
        worksheet.getCell('F8').font = {
          name: 'Arial',
          color: { argb: 'FF000000' },
          family: 2,
          bold:true,
          size: 11,
        };
        worksheet.getCell('F8').alignment = {
          vertical: 'middle',
          horizontal: 'center',//center
        }
        worksheet.getCell('F8').fill = {
          type: 'pattern',
          pattern:'solid',
          fgColor:{argb:'FFedece6'},
        };
        //#endregion
        
        //#region  Travel Time Column
        worksheet.getCell('G8').value = "Travel Time";
        worksheet.getCell('G8').font = {
          name: 'Arial',
          color: { argb: 'FF000000' },
          family: 2,
          bold:true,
          size: 11,
        };
        worksheet.getCell('G8').alignment = {
          vertical: 'middle',
          horizontal: 'center',//center
        }
        worksheet.getCell('G8').fill = {
          type: 'pattern',
          pattern:'solid',
          fgColor:{argb:'FFedece6'},
        };
        //#endregion
        
        
        //#endregion
        
        //#region Fill The Table rows
        let month_under_construction = new Date(this.selectedYear,this.selectedMonth,0);
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let totBillaHour=0;
        let rowNumb=0;
        for (let day = 1; day < (month_under_construction).getDate()+1; day++) {
          
          const date = new Date(this.selectedYear, this.selectedMonth - 1, day);
          const dayOfWeek = daysOfWeek[date.getDay()];
          const monthName = monthNames[Number(this.selectedMonth)-1] ; // Adjust month to be 0-indexed
          
          rowNumb=8+day;
          //default height for row
          worksheet.getRow(rowNumb).height=30;
          //#region Date 
          worksheet.getCell('A'+rowNumb).value =`${dayOfWeek}, ${day} ${monthName} ${this.selectedYear}`;
          worksheet.getCell('A'+rowNumb).font = {
            name: 'Arial',
            color: { argb: 'FF000000' },
            family: 4,
            bold:true,
            size: 11,
            // italic: true
          };
          worksheet.getCell('A'+rowNumb).alignment = {
            vertical: 'middle',
            horizontal: 'center',
          }
          
          //#endregion
          
          if(dayOfWeek.localeCompare("Sunday")==0||dayOfWeek.localeCompare("Saturday")==0){
            worksheet.getRow(rowNumb).height=30;
            worksheet.mergeCells('B'+rowNumb+':G'+rowNumb);
            worksheet.getCell('B'+rowNumb+':G'+rowNumb).fill = {
              type: 'pattern',
              pattern:'solid',
              fgColor:{argb:'FFFABF8F'},
            };
          }else{  
            let searchday=this.selectedYear+"-"+this.selectedMonth+"-"+day;
            if(day<10){
              searchday=this.selectedYear+"-"+this.selectedMonth+"-0"+day;
            }
            let  index = -1;
            index = data.findIndex(x => x.date === searchday);
            if(index!= -1){          
              //#region Site 
              worksheet.getCell('B'+rowNumb).value = data[index].site;
              worksheet.getCell('B'+rowNumb).font = {
                name: 'Arial',
                color: { argb: 'FF000000' },
                family: 4,
                bold:true,
                size: 11,
                // italic: true
              };
              worksheet.getCell('B'+rowNumb).alignment = {
                vertical: 'middle',
                horizontal: 'center',
              }
              
              //#endregion
              //#region Location 
              worksheet.getCell('C'+rowNumb).value = data[index].location;
              worksheet.getCell('C'+rowNumb).font = {
                name: 'Arial',
                color: { argb: 'FF000000' },
                family: 4,
                bold:true,
                size: 11,
              };
              worksheet.getCell('C'+rowNumb).alignment = {
                vertical: 'middle',
                horizontal: 'center',
              }
              worksheet.getCell('C'+rowNumb).fill = {
                type: 'pattern',
                pattern:'solid',
                fgColor:{argb:'FFedece6'},
              };
              //#endregion
              
              //#region Hours 
              totBillaHour+=data[index].billablehours;
              worksheet.getCell('F'+rowNumb).value = data[index].billablehours;
              worksheet.getCell('F'+rowNumb).font = {
                name: 'Arial',
                color: { argb: 'FF000000' },
                family: 4,
                bold:true,
                size: 11,
                // italic: true
              };
              worksheet.getCell('F'+rowNumb).fill = {
                type: 'pattern',
                pattern:'solid',
                fgColor:{argb:'FFedece6'},
              };
              worksheet.getCell('F'+rowNumb).alignment = {
                vertical: 'middle',
                horizontal: 'center',
              }
              //#endregion
              
              //#region Activity 
              let rowheight=1;
              let content=``;
              worksheet.mergeCells('D'+rowNumb+':E'+rowNumb);
              worksheet.getCell('D'+rowNumb+':E'+rowNumb).font = {
                name: 'Arial',
                color: { argb: 'FF000000' },
                family: 4,
                size: 11,
              };
              worksheet.getCell('D'+rowNumb+':E'+rowNumb).alignment = {
                vertical: 'middle',
                horizontal: 'center',
                wrapText: true
              }
              data[index].tasks.forEach(function(item:any) { 
                content+=`\n`+ item.task;
                rowheight++;
              }); 
              worksheet.getRow(rowNumb).height=(rowheight*30);
              worksheet.getCell('D'+rowNumb+':E'+rowNumb).value =`\n${content}`;
              //#endregion
              //#region Travel-Time 
              worksheet.getCell('G'+rowNumb).value = 0;
              worksheet.getCell('G'+rowNumb).font = {
                name: 'Arial',
                color: { argb: 'FF000000' },
                family: 4,
                bold:true,
                size: 11,
              };
              worksheet.getCell('G'+rowNumb).fill = {
                type: 'pattern',
                pattern:'solid',
                fgColor:{argb:'FFedece6'},
              };
              worksheet.getCell('G'+rowNumb).alignment = {
                vertical: 'middle',
                horizontal: 'center',
              }
              //#endregion
              
            }
          }
        } 
        //#endregion  
        
        //#region Total Billable Hours 
        rowNumb++;
        
        worksheet.getRow(rowNumb).height=40;
        
        
        worksheet.mergeCells('D'+rowNumb+':E'+rowNumb);
        worksheet.getCell('D'+rowNumb+':E'+rowNumb).value = "Total Billable Hours";
        
        worksheet.getCell('D'+rowNumb+':E'+rowNumb).font = {
          name: 'Arial',
          color: { argb: 'FF000000' },
          family: 4,
          size: 11,
          // italic: true
        };
        worksheet.getCell('D'+rowNumb+':E'+rowNumb).alignment = {
          vertical: 'middle',
          horizontal: 'center',
        }
        //-----------------------------
        worksheet.getCell('F'+rowNumb).value = totBillaHour;
        worksheet.getCell('F'+rowNumb).font = {
          name: 'Arial',
          color: { argb: 'FF000000' },
          family: 4,
          bold:true,
          size: 11,
          // italic: true
        };
        worksheet.getCell('F'+rowNumb).fill = {
          type: 'pattern',
          pattern:'solid',
          fgColor:{argb:'FFedece6'},
        };
        worksheet.getCell('F'+rowNumb).alignment = {
          vertical: 'middle',
          horizontal: 'center',
        }
        
        //#endregion
        
        //#region create border between cells
        worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
          row.eachCell({ includeEmpty: true }, function(cell, colNumber) {
            
            cell.border = {
              //top: { style: "medium",color: {argb:'FF00FF00'} },//You can use 'thin', 'medium', 'thick', or other valid styles
              top: { style: "medium"},
              left: { style: "medium" },
              bottom: { style: "medium" },
              right: { style: "medium" }
            };
          });
        });
        worksheet.getRow(7).
        eachCell({ includeEmpty: true }, function(cell, colNumber) {
          
          cell.border = {
            top: { style: "thin" },//You can use 'thin', 'medium', 'thick', or other valid styles        
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" }
          };
        });
        //#endregion
        
        //#region  download-file
        workbook.xlsx.writeBuffer().then((data: any) => {
          const blob = new Blob([data], {
            type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"
          });
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement("a");
          document.body.appendChild(a);
          a.setAttribute("style", "display: none");
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove();
        });
        //#endregion
      });  
    
    };

    onFileSelected(event: Event) {
      const target = event.target as HTMLInputElement;
      const file: File = (target.files as FileList)[0];
      this.selectedFile = file;
      target.value = '';
    };

  importfiles() {
    if (this.selectedFile != undefined) {
      const formData = new FormData()
      formData.append('file', this.selectedFile)
      this.timesheetService.importTimesheet(formData).subscribe((res) => {
        this.getTableData();
        this.toaster.typeSuccess("Data Imported","Success")
        this.model.closeModel('add_files');
      },
        (error) => {
          this.model.closeModel('add_files');
        })
      }
      
    };

    resetForm() {
      this.tasks = [];
      this.selectedFile = undefined;
    };

    openEditModal(timesheet: any, tasks: any) {
      this.editTimesheet = timesheet;
      this.editTimesheet.tasks = tasks;
      this.ngOnChanges();
    };

    
}
  export interface task {
    status: String;
    task: String;
    billable: Boolean;
  }
