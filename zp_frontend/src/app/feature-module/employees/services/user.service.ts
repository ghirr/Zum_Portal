import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/ENVIRONMENTS/environment';
import { AuthService } from '../../authentication/services/auth.service';
import { Observable, throwError } from 'rxjs';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  host = environment.apiUrl
  constructor(private http: HttpClient, private auth: AuthService) { }

  getUsers(): Observable<any> {
    return this.http.get(`${this.host}/auth/listuser/`)
  }
  getUsersGrid(): Observable<any> {
    return this.http.get(`${this.host}/auth/list-user/`)
  }
  getAllRoles(): Observable<any> {
    return this.http.get<any>(`${this.host}/auth/getAllRoles/`);
  }
  addUser(newUser: any) {
    return this.http.post<any>(`${this.host}/auth/register-user/`, newUser);
  }
  deleteUser(id: any) {
    return this.http.delete(`${this.host}/auth/deleteUser/` + id);
  }
  updateUser(id: any, user: any): Observable<any> {
    return this.http.put(`${this.host}/auth/updateUser/${id}`, user);
  }
  getUserById(id: any): Observable<any> {
    return this.http.get(`${this.host}/auth/getUser/${id}`);
  }
  getUserDetails(id: any): Observable<any> {
    return this.http.get(`${this.host}/auth/profiles/${id}`);
  }
  getManagers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.host}/auth/managers`);
  }
  getUserByRole(): Observable<any> {
    return this.http.get(`${this.host}/auth/fetchUsersByRole/`);
  }
  updateEmployeeDetails(userId: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.host}/auth/profiles/update/${userId}/`, formData);
  }
  getPermissionsModel(): Observable<any[]> {
    return this.http.get<any[]>(`${this.host}/auth/permissions`);
  }
  


  

  getUserAssets(userId: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.host}/auth/users/${userId}/assets/`);
  }
  getAssetDetails(assetId: any) {
    return this.http.get<any>(`${this.host}/auth/assets/${assetId}/`);
  }
  getAllAssets() {
    return this.http.get<any>(`${this.host}/auth/assets/`);
  }

  addAssetsToUser(userId: number, assetData: any): Observable<any> {
    return this.http.post<any>(`http://localhost:8000/auth/users/${userId}/add-assets/`, assetData);
  }

  getAssetTypes(): Observable<string[]> {
    return this.http.get<string[]>(`${this.host}/auth/assetsTypes/`);
  }
  updateAsset(userId: any, assetId: any, formData: any): Observable<any> {
    return this.http.put<any>(`${this.host}/auth/users/${userId}/assets/${assetId}/`, formData);
  }
  deleteAsset(userId: any, assetId: any): Observable<any> {
    return this.http.delete<any>(`${this.host}/auth/users/${userId}/assets/${assetId}/`);
  }

  getStatusChoices(): Observable<any> {
    return this.http.get(`${this.host}/attendance/status-choices/`);
  }

  // Method to update the status of a specific attendance record
  updateEmployeeStatus(employeeId: number, data: any): Observable<any> {
    return this.http.put(`${this.host}/attendance/employee/${employeeId}/`, data);
  }

  // Method to get all attendance data
  getAllAttendance(): Observable<any> {
    return this.http.get(`${this.host}/attendance/attendances/`);
  }

}
