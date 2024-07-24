import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/ENVIRONMENTS/environment';

@Injectable({
  providedIn: 'root'
})
export class ContractsService {
  host = environment.apiUrl
  constructor(private http: HttpClient) { }
  
    getContracts(){
      return this.http.get<any[]>(`${this.host}/contracts/employees/`);
    }

    addcontract(contract:any){
      return this.http.post(`${this.host}/contracts/add/`,contract);
    }
    editContract(contract:any,id:any){
      return this.http.put(`${this.host}/contracts/edit/`+id+'/',contract);
    }
    deleteContract(id:any){
      return this.http.delete(`${this.host}/contracts/edit/`+id);
    }
}
