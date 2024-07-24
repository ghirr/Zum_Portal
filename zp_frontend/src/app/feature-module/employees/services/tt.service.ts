import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/ENVIRONMENTS/environment';
import { AuthService } from '../../authentication/services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TtService {

  host = environment.apiUrl
  constructor(private http: HttpClient,private auth:AuthService) { }

  
  getTTLeaves(){
    return this.http.get<any[]>(`${this.host}/tt/`+this.auth.getUser().id);
  }
  getRemainingTT(){
    return this.http.get<any[]>(`${this.host}/tt/remain/`+this.auth.getUser().id);
  }
  addTTRequest(tt:FormData): Observable<any>{
    tt.append('user',this.auth.getUser().id)
    return this.http.post<any>(`${this.host}/tt/create/`,tt,{ observe: 'response' });
  }
  editTTRequest(tt:FormData,id:number): Observable<any>{
    return this.http.put<any>(`${this.host}/tt/edit/`+id,tt,{ observe: 'response' });
  }
  deleteTTRequest(id:number): Observable<any>{
    return this.http.delete<any>(`${this.host}/tt/delete/`+id);
  }
  getTTAll(){
    return this.http.get<any[]>(`${this.host}/tt`);
  }

  getTTApprovels(){
    return this.http.get<any[]>(`${this.host}/tt/ttapprovers/`+this.auth.getUser().id)
  }

  setStatusTTApprovels(leave:any){
    return this.http.put<any>(`${this.host}/tt/ttapprovers/`+this.auth.getUser().id,leave)
  }
}
