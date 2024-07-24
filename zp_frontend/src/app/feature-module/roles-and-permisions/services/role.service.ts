import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/ENVIRONMENTS/environment';
import { AuthService } from '../../authentication/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  host = environment.apiUrl
  constructor(private http: HttpClient,private authService:AuthService) { }
  
    getRoles(){
      return this.http.get<any[]>(`${this.host}/auth/roles/`);
    }

    getPermissionsModels(){
      return this.http.get<any[]>(`${this.host}/auth/permissions/`);
    }

    updateRolePermissions(roleId:any,permissions:any){
      
    let user=this.authService.getUser();
        if(user.role='Admin' && roleId==6){
          user.permissions=permissions;
          this.authService.addUserToLocalCache(user);
        }
      return this.http.put(`${this.host}/auth/roles/permissions/`+roleId,permissions)
    }
}
