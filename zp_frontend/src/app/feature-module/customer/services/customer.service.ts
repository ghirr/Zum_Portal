import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/ENVIRONMENTS/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  public host = environment.apiUrl+'/customer/';

  constructor(private http: HttpClient) { }


  getCustomers (): Observable<any>{
    return this.http.get(this.host);
  }

  getCustomerById (id:any): Observable<any>{
    return this.http.get(this.host+id);
  }

  addCustomer(customer:FormData): Observable<any>{
    return this.http.post<any>(this.host,customer,{ observe: 'response' });
  }

  editCustomer(id:any,customer:FormData): Observable<any>{
    return this.http.put<any>(this.host+id+'/',customer);
  }

  deleteCustomer(id:any){
    return this.http.delete(this.host+id+'/');
  }

  deleteCustomerFile(fileid:any){
    return this.http.delete(this.host+'files/delete/'+fileid)
  }

  addCustomerFile(customerid:any,files:FormData){
    return this.http.post(this.host+'files/'+customerid+'/',files)
  }

  getCustomerFile(customerid:any){
    return this.http.get(this.host+'files/'+customerid)
  }

  downloadFile(file:any){

    return this.http.get(environment.apiUrl+file,{
      responseType: 'blob'
    })
  }
  
}
