import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomersComponent } from './customers.component';
import { CustomersListComponent } from './customers-list/customers-list.component';
import { CustomersPageComponent } from './customers-page/customers-page.component';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';

const routes: Routes = [
  {
    path:'',
    component:CustomersComponent,
    children: [
      { path:'customer-list' , component:CustomersListComponent},
      { path:'customer-page', component:CustomersPageComponent},
      { path:'customer-details/:id', component:CustomerDetailsComponent}
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
