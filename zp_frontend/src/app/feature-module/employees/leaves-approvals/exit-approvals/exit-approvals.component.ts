import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataService, apiResultFormat, getOffer, routes } from 'src/app/core/core.index';
import { environment } from 'src/app/ENVIRONMENTS/environment';
import { ModalService } from 'src/app/Common/commonservices/modal.service';
import { ToasterService } from 'src/app/core/services/toaster/toaster.service';
import { LeaveService } from '../../services/leave.service';
import { ExitAuthorizationService } from '../../services/exit-authorization.service';

@Component({
  selector: 'app-exit-approvals',
  templateUrl: './exit-approvals.component.html',
  styleUrls: ['./exit-approvals.component.scss']
})
export class ExitApprovalsComponent implements OnInit {
  public lstOffer: Array<any> = [];
  public searchDataValue = '';
  dataSource!: MatTableDataSource<getOffer>;
  public routes = routes;
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
  //** / pagination variables

  base=environment.apiUrl
  exit:any={};

  constructor(private data: DataService,private exitService:ExitAuthorizationService,private model:ModalService,
              private toaster:ToasterService
  ) {}

  ngOnInit(): void {
    this.getTableData();
  }

  private getTableData(): void {
    this.lstOffer = [];
    this.serialNumberArray = [];

    this.exitService.getExitsApprovels().subscribe((res: any) => {
      this.totalData = res.length;
      res.map((res: any, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          res.leaveApproveId = serialNumber;
          this.lstOffer.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
      this.dataSource = new MatTableDataSource<any>(this.lstOffer);
      this.calculateTotalPages(this.totalData, this.pageSize);
    });

 
  }

  public sortData(sort: Sort) {
    const data = this.lstOffer.slice();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (!sort.active || sort.direction === '') {
      this.lstOffer = data;
    } else {
      this.lstOffer = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.lstOffer = this.dataSource.filteredData;
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

  public changePageSize(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
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

  passData(exit:any,status:String){
    this.exit.id=exit?.id;
    this.exit.exit=exit?.exit.id;
    this.exit.status=status;
  }
  approveLeave(){
    this.exitService.setStatusExitsApprovels(this.exit).subscribe((res)=>{
      this.getTableData();
      this.toaster.typeSuccess("Exit "+this.exit.status,"Success")
      this.model.closeModel('exit_leave');
    },
    (error)=>{
      this.model.closeModel('exit_leave');
    }
  
  )
    
  }
}
export interface pageSelection {
  skip: number;
  limit: number;
}

