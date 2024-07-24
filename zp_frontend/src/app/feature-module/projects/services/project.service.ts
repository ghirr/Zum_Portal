import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

const host = 'http://localhost:8000';
@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient) { }

  addNewProject(formData: FormData): Observable<any>{
    return this.http.post<any>(host + `/project/add-project/`, formData);

  }

  getAllProjects(): Observable<any>{
    return this.http.get(host + `/project/list-project/`);

  }

  getProjectById(id : any): Observable<any>{
    return this.http.get(host + `/project/getproject/` + id);

  }
  getAllProjectTeamById(id : any): Observable<any>{
    return this.http.get(host + `/project/getprojectteam/` + id);

  }
  deleteProjectById(id : any){
    return this.http.delete(host + `/project/delete-project/`+id);
  }

  updateProject(id:any , project: any): Observable<any>{
    return this.http.put(host + `/project/update-project/` +  id , project);
  }
  
  updateStatus(id: any, status: string): Observable<any> {
    return this.http.patch(`${host}/project/update-project/${id}`, { status });
  }

  // Method to convert file size from bytes to human-readable format
  getSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
  }

  uploadFile(projectId:any,files:FormData){
    return this.http.post(`${host}/project/upload-file/${projectId}/`,files)
  }
  

  deleteFile(fileId: any): Observable<any> {
    return this.http.delete<any>(`${host}/project/delete-file/${fileId}/`);
  }

  updateProjectManager(projectId: any, managerId: any): Observable<any> {
    return this.http.put<any>(`${host}/project/update-manager/${projectId}/`, { project_manager: managerId });
  }
  updateScrumMaster(projectId: any, scrumId: any): Observable<any> {
    return this.http.put<any>(`${host}/project/update-scrum/${projectId}/`, { scrum_master: scrumId });
  }
  updateProjectTeam(projectId: any, teamMembers: any[]): Observable<any> {
    return this.http.put<any>(`${host}/project/update-team/${projectId}/`, { team_members: teamMembers });
  }

  deleteProjectMember(projectId: number, memberId: number): Observable<any> {
    return this.http.delete<any>(`${host}/project/delete-member/${projectId}/`, { params: { member_id: memberId.toString() } });
  }

  downloadFile(fileUrl: string): Observable<Blob> {
    return this.http.get(fileUrl, { responseType: 'blob' });
  }

  getProjectsByUser(userId: any): Observable<any[]> {
    return this.http.get<any[]>(`${host}/project/employee/${userId}`);
  }

  getProjectsByCustomer(id:any){
    return this.http.get(`${host}/project/`+id);
  }

}
