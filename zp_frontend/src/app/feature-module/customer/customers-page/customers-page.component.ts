import { Component } from '@angular/core';
import { getClient, routes } from 'src/app/core/core.index';
import { CustomerService } from '../services/customer.service';
import { MatTableDataSource } from '@angular/material/table';
import { common } from 'src/app/Common/common';
import { AuthService } from '../../authentication/services/auth.service';

@Component({
  selector: 'app-customers-page',
  templateUrl: './customers-page.component.html',
  styleUrls: ['./customers-page.component.scss']
})
export class CustomersPageComponent {
  public routes = routes;
  public clientsData: any;
  selectedCustomer: any;
  dataSource!: MatTableDataSource<getClient>;
  searchCustomerName:any;
  permissions:any=[];
  
  constructor(private customerService:CustomerService,private authService:AuthService) {
   
  }
  selected1 = 'option1';

  ngOnInit():void{
    this.getCustomers();
    this.permissions=this.authService.getUser().permissions;
  }

  getCustomers(){
    this.customerService.getCustomers().subscribe((res)=>{
      this.clientsData=res;
      this.dataSource = new MatTableDataSource<any>(this.clientsData);
    })
  }

  passCustomerData(customer:any){
    this.selectedCustomer=customer;
  }
  handleFormSubmission() {
    this.getCustomers();
  }
  
  public searchData(clientName: string): void {
    const lowerCaseSearchTerm = clientName.trim().toLowerCase();
  
    if (lowerCaseSearchTerm === '') {
      // If the search term is empty, show all data
      this.clientsData = this.dataSource.filteredData;
    } else {
      // Filter data based on the search term
      this.clientsData = this.dataSource.filteredData.filter(client => 
        Object.values(client).some(value => 
          value !== null && value.toString().toLowerCase().includes(lowerCaseSearchTerm)
        )
      );
    }
  }

}
