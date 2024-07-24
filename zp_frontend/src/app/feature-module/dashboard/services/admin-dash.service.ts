import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/ENVIRONMENTS/environment';
import { AuthService } from '../../authentication/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminDashService {
  public host = environment.apiUrl+'/dashboard/admin';
  public host2 = environment.apiUrl+'/dashboard/employee';

  constructor(private http: HttpClient,private authService:AuthService) { }


  getHeader (): Observable<any>{
    return this.http.get(this.host+'/header');
  }
  getEmployeeRoleDistribution(){
    return this.http.get(this.host+'/employee-role-distribution/');
  }

  getGenderDistribution() {
    return this.http.get(this.host+'/gender-distribution/');
  }
  getEmployeeWorkHours(){
    return this.http.get(this.host+'/employee-work-hours/');
  }
  getLeaveUsage(){
    return this.http.get(this.host+'/leave-usage/');
  }
  getTasksStatistics(){
    return this.http.get(this.host+'/task_statistics/');
  }
  getLatestProjectsAndCustomers(){
    return this.http.get(this.host+'/projectsandcustomers/');
  }

  getEmployeeProjects(): Observable<any> {
    return this.http.get(`${this.host2}/projectstatus/`+this.authService.getUser().id);
  }

  getEmployeeOverView(): Observable<any> {
    return this.http.get(`${this.host2}/userOverview/`+this.authService.getUser().id);
  }
}
