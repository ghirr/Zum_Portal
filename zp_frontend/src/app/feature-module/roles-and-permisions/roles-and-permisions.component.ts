import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RoleService } from './services/role.service';
import { AuthService } from '../authentication/services/auth.service';
@Component({
  selector: 'app-roles-and-permisions',
  templateUrl: './roles-and-permisions.component.html',
  styleUrls: ['./roles-and-permisions.component.scss']
})
export class RolesAndPermisionsComponent {
   allroles: Array<any>=[];
   models: Array<any>=[];
   activeIndex: number = 0;

  selectedRole:any;
  permissions:any=[];
  Permissions:Array<string>=[];
  permissionsM:string[][] = [['Read','view'], ['Write','change'], ['Create','add'], ['Delete','delete'], ['Import','import'], ['Export','export']];
  constructor(public router: Router, private roleService: RoleService) {
    this.getAllRoles();
    this.getAllModels();
  }

  getAllRoles(){
    this.roleService.getRoles().subscribe((res)=>{
      this.allroles=res;
      this.Permissions=res[0].permissions
      this.selectedRole=res[0].id
    })
  }

  getAllModels(){
    this.roleService.getPermissionsModels().subscribe((res:any)=>{
      this.models=res.models;
    })
  }

  setActiveIndex(index: number,role:any): void {
    this.activeIndex = index;
    this.Permissions=role.permissions
    this.selectedRole=role.id
  }

  setPermissions(event:Event){
    const target = event.target as HTMLInputElement;
    if(target.checked){
    this.Permissions.push(target.value)
    this.roleService.updateRolePermissions(this.selectedRole,this.Permissions).subscribe()
    }
    else{
      this.Permissions.splice(this.Permissions.indexOf(target.value),1)
      this.roleService.updateRolePermissions(this.selectedRole,this.Permissions).subscribe()
    }
  }
}
