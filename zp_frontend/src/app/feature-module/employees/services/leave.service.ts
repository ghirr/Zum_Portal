import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/ENVIRONMENTS/environment';
import { AuthService } from '../../authentication/services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {

  host = environment.apiUrl
  constructor(private http: HttpClient,private auth:AuthService) { }
  
    getLeavesTypes(){
      return this.http.get<any[]>(`${this.host}/leaves/leave-types/`);
    }
    editLeaveType(leave:any){
      return this.http.put(`${this.host}/leaves/leave-types/`+leave.id,leave);
    }
    getEmployeeLeaves(){
      return this.http.get<any[]>(`${this.host}/leaves/`+this.auth.getUser().id);
    }
    getAllLeaves(){
      return this.http.get<any[]>(`${this.host}/leaves`);
    }
    getRemainingLeaves(){
      return this.http.get<any[]>(`${this.host}/leaves/remain/`+this.auth.getUser().id);
    }
    addLeaveRequest(leave:FormData): Observable<any>{
      leave.append('user',this.auth.getUser().id)
      return this.http.post<any>(`${this.host}/leaves/create/`,leave,{ observe: 'response' });
    }
    editLeaveRequest(leave:FormData,id:number): Observable<any>{
      return this.http.put<any>(`${this.host}/leaves/edit/`+id,leave,{ observe: 'response' });
    }
    deleteLeaveRequest(id:number): Observable<any>{
      return this.http.delete<any>(`${this.host}/leaves/delete/`+id);
    }

    getLeavesApprovels(){
      return this.http.get<any[]>(`${this.host}/leaves/leaveapprovers/`+this.auth.getUser().id)
    }

    setStatusLeavesApprovels(leave:any){
      return this.http.put<any>(`${this.host}/leaves/leaveapprovers/`+this.auth.getUser().id,leave)
    }

    getAdminHeader(){
      return this.http.get<any[]>(`${this.host}/leaves/header`);
    }

}
