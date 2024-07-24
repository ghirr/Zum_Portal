import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../authentication/services/auth.service';
import { AdminDashService } from '../services/admin-dash.service';

import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexTitleSubtitle, ApexXAxis } from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.scss']
})
export class EmployeeDashboardComponent implements OnInit{

  user:any;
  today=new Date();
  public chartOptions: Partial<ChartOptions> |any;
  Attendance:any;
  public chartOptions2: Partial<ChartOptions> |any;
  numOfProjects:any=0;
  numOfCompletedTasks:any=0;
  numOfOthersTasks:any=0;

constructor(private authService:AuthService,private dash:AdminDashService){
}


  ngOnInit(): void {
    this.user=this.authService.getUser()
    this.ProjectsProgress()
    this.employeeOverView()
  }

  
  isWeekend(): boolean {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 for Sunday, 6 for Saturday
    return dayOfWeek === 0 || dayOfWeek === 6;
  }

  ProjectsProgress(){
    this.dash.getEmployeeProjects().subscribe(data => {
      const projectNames = data.map((project:any) => project.name);
      const projectStatuses = data.map((project:any) => project.status);

      this.chartOptions = {
        series: [
          {
            name: 'Status',
            data: projectStatuses.map((status:any) => status === 'Active' ? 1 : 0) // Assuming 'Active' is 1 and others are 0
          }
        ],
        chart: {
          type: 'bar'
        },
        xaxis: {
          categories: projectNames
        },
        dataLabels: {
          enabled: false
        },
      };
    });
  }

  employeeOverView(){
    this.dash.getEmployeeOverView().subscribe(data => {
      this.Attendance=data.attendance_status;
      this.numOfProjects=data.projects_count
      this.numOfCompletedTasks=data.completed_tasks_count;
      this.numOfOthersTasks=data.other_tasks_count;
      
  this.chartOptions2 = {
    series: [
      data.remaining_leaves,
      data.remaining_TT,
      data.remaining_exit
    ],
    chart: {
      type: 'donut'
    },
    labels: ['Remaining Leaves', 'Remaining TT', 'Remaining Exit'],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    ]
  };
    });
  }

  }


