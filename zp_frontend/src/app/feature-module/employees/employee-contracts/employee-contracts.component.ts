import { Component } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataService, apiResultFormat, getPayment, routes } from 'src/app/core/core.index';
import { ContractsService } from '../services/contracts.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { ModalService } from 'src/app/Common/commonservices/modal.service';
import { ToasterService } from 'src/app/core/services/toaster/toaster.service';
import { AuthService } from '../../authentication/services/auth.service';

@Component({
  selector: 'app-employee-contracts',
  templateUrl: './employee-contracts.component.html',
  styleUrls: ['./employee-contracts.component.scss']
})
export class EmployeeContractsComponent {
  public allPayments: Array<any> = [];
  public searchDataValue = '';
  dataSource!: MatTableDataSource<any>;
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
  addContractForm!: FormGroup;
  editContractForm!: FormGroup;
  submitted = false;
  showErrorAlert = false;
  errorMessage = '';
  employees:any=[];

  permissions:any=[];
  contractToEdit:any;

  constructor(private contarctsService: ContractsService,private formBuilder: FormBuilder,
    private userService:UserService,private modal:ModalService,private toaster:ToasterService,private authService:AuthService) {}
  ngOnInit(): void {
    this.addContractForm = this.formBuilder.group({
      user: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: '',
      contract_type: ['', Validators.required],
      salary: ['', Validators.required]
    });
    this.editContractForm = this.formBuilder.group({
      user: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: '',
      contract_type: ['', Validators.required],
      salary: ['', Validators.required]
    });
    this.getTableData();
    this.getEmployees();
    this.permissions=this.authService.getUser().permissions;
  }

  private getTableData(): void {
    this.allPayments = [];
    this.serialNumberArray = [];

    this.contarctsService.getContracts().subscribe((res: any) => {
      this.totalData = res.length;
      res.map((res: any, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          res.id = serialNumber;
          this.allPayments.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
      this.dataSource = new MatTableDataSource<getPayment>(this.allPayments);
      this.calculateTotalPages(this.totalData, this.pageSize);
    });

 
  }

  public sortData(sort: Sort) {
    const data = this.allPayments.slice();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (!sort.active || sort.direction === '') {
      this.allPayments = data;
    } else {
      this.allPayments = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.allPayments = this.dataSource.filteredData;
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
  get f() { return this.addContractForm.controls; }
  get g() { return this.editContractForm.controls; }
  addContract() {
    this.submitted = true;

    if (this.addContractForm.invalid) {
      return;
    }

    this.addContractForm.value.start_date=this.modal.formatDate(this.addContractForm.value.start_date)
    if(this.addContractForm.value.end_date){
    this.addContractForm.value.end_date=this.modal.formatDate(this.addContractForm.value.end_date)
    }
    else{
      this.addContractForm.value.end_date=null
    }
    this.contarctsService.addcontract(this.addContractForm.value).subscribe((res)=>{
      this.toaster.typeSuccess('Contract added',"Success");
      this.getTableData();
      this.modal.closeModel('add_contract')
      this.resetForm();
    },
  (error)=>{
      this.modal.closeModel('add_contract')
      this.resetForm();
  })
  }

  
editContract() {
  this.submitted = true;

  if (this.editContractForm.invalid) {
    return;
  }

  this.editContractForm.value.start_date=this.modal.formatDate(this.editContractForm.value.start_date)
    if(this.editContractForm.value.end_date){
    this.editContractForm.value.end_date=this.modal.formatDate(this.editContractForm.value.end_date)
    }
    else{
      this.editContractForm.value.end_date=null
    }
    
    this.contarctsService.editContract(this.editContractForm.value,this.contractToEdit.id).subscribe((res:any)=>{
      this.toaster.typeSuccess('Contract Edited',"Success");
      this.getTableData();
      this.modal.closeModel('edit_contract')
      this.resetForm();
    },
  (error:any)=>{
      this.modal.closeModel('edit_contract')
      this.resetForm();
  })
  }
  

  resetForm() {
    this.submitted = false;
    this.showErrorAlert = false;
    this.errorMessage = '';
    this.addContractForm.reset();
    this.addContractForm.patchValue({
      user:this.employees[0].id
    })
  }

  getEmployees(){
    this.userService.getUsers().subscribe((res)=>{
      this.employees=res;
      this.addContractForm.patchValue({
        user:res[0].id
      })
    })
  }

  passContractData(contract: any) {
    this.contractToEdit=contract;    
    this.editContractForm.patchValue({
      user:this.contractToEdit.user,
      start_date:new Date(this.contractToEdit.start_date),
      end_date:new Date(this.contractToEdit.end_date),
      contract_type: this.contractToEdit.contract_type,
      salary: this.contractToEdit.salary
    })
  }

    deleteContract() {
    this.contarctsService.deleteContract(this.contractToEdit.id).subscribe((res)=>{
      this.getTableData()
      this.toaster.typeSuccess("contract Deleted","Success")
      this.modal.closeModel('delete_contract')
    })
    }
}
export interface pageSelection {
  skip: number;
  limit: number;
}