import {Component, OnInit, ViewChild } from "@angular/core";

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexTooltip,
  ApexFill,
  ApexResponsive

} from "ng-apexcharts";
import { routes } from "src/app/core/helpers/routes/routes";
import { AdminDashService } from "../services/admin-dash.service";
import { ChartData } from "chart.js";
import { common } from "src/app/Common/common";
/* eslint-disable @typescript-eslint/no-explicit-any */
export type ChartOptions = {
  series: ApexAxisChartSeries | any;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis | ApexYAxis[];
  legend: ApexLegend;
  tooltip: ApexTooltip;
  responsive: ApexResponsive[];
  fill: ApexFill;
  labels: string[];

};

@Component({
  selector: "app-admin-dashboard",
  templateUrl: "./admin-dashboard.component.html",
  styleUrls: ["./admin-dashboard.component.scss"],
})
export class AdminDashboardComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent | any;
  public chartOptions2: Partial<ChartOptions> | any;
  public chartOptions1: Partial<ChartOptions> | any;
  
  public chartOptionsFive: Partial<ChartOptions>| any;
  public chartOptionsFour: Partial<ChartOptions>| any;
  public layoutWidth = '1';
  public routes = routes;

  numOfprojects:Number=0;
  numOfemployees:Number=0;
  numOfcustomers:Number=0;
  numOftasks:Number=0;
  taskStatistics:any;
  projects:any=[];
  customers:any=[];
  image=common.profileImage;
  
  public pieChartData: ChartData<'pie', number[], string | string[]> |any;

  constructor(private adminDash:AdminDashService) {
    this.pieChartData = {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: []
      }]
    };
   }
  ngOnInit(): void {
    this.getHeaderContent()
    this.getEmployeeRoleDistribution()
    this.getGenderDistribution()
    this.getEmployeeWorkHour()
    this.getLeaveUsage()
    this.getTasks()
    this.getProjectsAndCustomers()
    
  }

  getHeaderContent(){
    this.adminDash.getHeader().subscribe((res)=>{
      this.numOfprojects=res.projects;
      this.numOfcustomers=res.customers;
      this.numOfemployees=res.employees;
      this.numOftasks=res.tasks;
    })
  }

  getEmployeeRoleDistribution() {
    this.adminDash.getEmployeeRoleDistribution().subscribe((res) => {
      const categories = Object.keys(res);
      const data = Object.values(res);

      this.chartOptionsFive = {
        series: [
          {
            name: "Num Of Employees",
            data: data,
            color: '#ff9b44',
          }
        ],
        chart: {
          type: "bar",
          height: 350
        },
        plotOptions: {
          bar: {
            horizontal: true
          }
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          categories: categories
        }
      };
    });
  }

  getGenderDistribution() {
    this.adminDash.getGenderDistribution().subscribe((res) => {
      this.pieChartData = {
        labels: Object.keys(res),
        datasets: [{
          data: Object.values(res),
          backgroundColor: [ '#36A2EB','#FF6384']
        }]
      };
    });
  }

  getEmployeeWorkHour(){
    this.adminDash.getEmployeeWorkHours().subscribe((data:any)=>{
        // Extract months and hours from the data
    const months = data.map((item:any) => item.month);
    const billableHours = data.map((item:any) => item.billable_hours);
    const notBillableHours = data.map((item:any) => item.not_billable_hours);

    // Update chartOptions2 with the fetched data
    this.chartOptions2 = {
      series: [
        {
          name: 'Billable Hours',
          data: billableHours,
          color: '#ff9b44',
        },
        {
          name: 'Not Billable Hours',
          data: notBillableHours,
          color: '#fc6075',
        },
      ],
      chart: {
        type: 'bar',
        height: 350
      },
      grid: {
        xaxis: {
          lines: {
            show: false
          }
        },
        yaxis: {
          lines: {
            show: true
          }
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '70%',
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: months.map((month:any) => month.toString().slice(0,3)),
      },
      yaxis: {
        title: {
          text: '$ (thousands)'
        }
      },
      fill: {
        opacity: 1
      },
    };
    })
  }

  getLeaveUsage(){
    this.adminDash.getLeaveUsage().subscribe((data:any) => {
      const leaveTypes = Object.keys(data);
      const months = data[leaveTypes[0]].map((entry: { month: string; }) => entry.month);
      const series = leaveTypes.map(type => ({
        name: type,
        data: data[type].map((entry: { count: number; }) => entry.count),
      }));

      this.chartOptionsFour = {
        series: series,
        chart: {
          type: 'bar',
          height: 350,
          stacked: true,
          toolbar: {
            show: true,
          },
          zoom: {
            enabled: true,
          },
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              legend: {
                position: 'bottom',
                offsetX: -10,
                offsetY: 0,
              },
            },
          },
        ],
        plotOptions: {
          bar: {
            horizontal: false,
          },
        },
        xaxis: {
          type: 'category',
          categories: months,
        },
        legend: {
          position: 'right',
          offsetY: 40,
        },
        fill: {
          opacity: 1,
        },
      };
    });
  }

  getTasks(){
    this.adminDash.getTasksStatistics().subscribe((res:any)=>{
      this.taskStatistics=res;
    })
  }

  getProjectsAndCustomers(){
    this.adminDash.getLatestProjectsAndCustomers().subscribe((data:any)=>{
      this.customers=data.customers;
      this.projects=data.projects;
    })
  }

}
