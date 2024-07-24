import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { CustomersComponent } from './customers.component';
import { CustomersListComponent } from './customers-list/customers-list.component';
import { CustomersModalComponent } from './customers-modal/customers-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatSortModule } from '@angular/material/sort';
import { SharedModule } from 'src/app/shared/shared.module';
import { CustomersPageComponent } from './customers-page/customers-page.component';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';



@NgModule({
  declarations: [
    CustomersComponent,
    CustomersListComponent,
    CustomersModalComponent,
    CustomersPageComponent,
    CustomerDetailsComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    SharedModule
  ]
})
export class CustomerModule { }
