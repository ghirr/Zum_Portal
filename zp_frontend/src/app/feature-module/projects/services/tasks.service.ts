import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/ENVIRONMENTS/environment';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  host = environment.apiUrl
  constructor(private http: HttpClient) { }

  getTasksByProjectId(id: any): Observable<any> {
    return this.http.get(`${this.host}/task/TaskByProject/${id}`); 
  }

  addTask(task: any): Observable<any>{
    return this.http.post<any>(this.host+`/task/addTask`, task);
  }

  editTask(task: any): Observable<any>{
    return this.http.put<any>(this.host+`/task/addTask/`+task.id, task);
  }

  deleteTask(id: any): Observable<any>{
    return this.http.delete<any>(this.host+`/task/addTask/`+id);
  }

  chnageStatus(taskId:any,newStatus:any){
    return this.http.put<any>(this.host+`/task/change-status/${taskId}`, { status: newStatus })
  }
}
