import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../authentication/services/auth.service';
import { environment } from 'src/app/ENVIRONMENTS/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExitAuthorizationService {
  host = environment.apiUrl
  constructor(private http: HttpClient,private auth:AuthService) { }

  
  getExitLeaves(){
    return this.http.get<any[]>(`${this.host}/tt/exit/`+this.auth.getUser().id);
  }
  addExitRequest(exit:FormData): Observable<any>{
    exit.append('user',this.auth.getUser().id)
    return this.http.post<any>(`${this.host}/tt/exit/create/`,exit,{ observe: 'response' });
  }
  editExitRequest(exit:FormData,id:number): Observable<any>{
    return this.http.put<any>(`${this.host}/tt/exit/edit/`+id,exit,{ observe: 'response' });
  }
  deleteExitRequest(id:number): Observable<any>{
    return this.http.delete<any>(`${this.host}/tt/exit/delete/`+id);
  }
  getAdminExit(){
    return this.http.get<any[]>(`${this.host}/tt/exit`);
  }

  getExitsApprovels(){
    return this.http.get<any[]>(`${this.host}/tt/exit/exitapprovers/`+this.auth.getUser().id)
  }

  setStatusExitsApprovels(leave:any){
    return this.http.put<any>(`${this.host}/tt/exit/exitapprovers/`+this.auth.getUser().id,leave)
  }
}
