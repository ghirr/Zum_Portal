import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/ENVIRONMENTS/environment';

@Injectable({
  providedIn: 'root'
})
export class TimesheetService {

  public host = environment.apiUrl+'/timesheet/';

  constructor(private http: HttpClient) { }


  getProjectsByEmpoyeeId (id:any): Observable<any>{
    return this.http.get(environment.apiUrl+'/project/employee/'+id);
  }

  getProjects (): Observable<any>{
    return this.http.get(environment.apiUrl+'/project/list');
  }
  getEmployeeTimesheets(): Observable<any> {
    return this.http.get<any>(`${this.host}employee-timesheets/`);
  }
  getTimesheets(): Observable<any> {
    return this.http.get<any>(`${this.host}timesheets/`);
  }
  getProjectsByEmployeeId(id: any): Observable<any> {
    return this.http.get(environment.apiUrl + '/timesheet/' + id);
  }  

  getTimesheetByProjectId(projectId:any): Observable<any>{
    return this.http.get(this.host+'projectid/'+projectId);
  }

  getEmployeesByProjectId(projectId:any): Observable<any>{
    return this.http.get(environment.apiUrl+'/project/employees/'+projectId);
  }

  addTimesheet(timesheet:any){
    return this.http.post(this.host,timesheet)
  }

  editTimesheet(timesheet:any){
    return this.http.put(this.host+timesheet.id+'/',timesheet)
  }

  deleteTimesheet(id:any){
    return this.http.delete(this.host+id+'/')
  }

  downloadTimesheets(employeeId:any,month:any,year:any): Observable<Blob> {
  /*  const headers = new HttpHeaders({
      'Content-Type': 'text/csv'
    });*/
    const headers = new HttpHeaders({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    return this.http.get(this.host+'excel/'+year+'/'+month+'/'+employeeId, {
      headers: headers,
      responseType: 'blob'
    });
  }

  importTimesheet(file:FormData): Observable<any>{
    return this.http.post(this.host+'excel',file);
  }
}
