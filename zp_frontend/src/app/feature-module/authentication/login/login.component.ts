import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { routes } from 'src/app/core/core.index';
import { WebStorage } from 'src/app/core/services/storage/web.storage';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

interface returndata {
  message: string | null;
  status: string | null;
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public routes = routes;
  public Toggledata = true;
  Error=false;
  form = new UntypedFormGroup({
    email: new UntypedFormControl('', [Validators.required]),
    password: new UntypedFormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  constructor(private authService:AuthService,private router:Router) {
  }

  ngOnInit() {
  }

  submit() {
    if (!this.form.valid) {
      return;
    }
    
    this.authService.login(this.form.value).subscribe(
      (res) => {
        
        //  const token =response.headers.get(HeaderType.JWT_TOKEN);
        const token = res.body['tokens']['tokens']['access']
        //  const token =response.body['token']
        this.authService.saveToken(token);
        //get user by refrech token 
        this.authService.addUserToLocalCache(res.body);
        localStorage.setItem('logintime',Date())
        if(['Admin','Talent Management','General Manager'].includes(this.authService.getUser().role.name)){
        this.router.navigate([routes.admin]);
        }
        else{
          this.router.navigate([routes.employee])
        }
        },
      (error) => {
        if(error.status==400 ||error.status==401){
          this.Error = true;
        }
      }
    );
  }
  

  iconLogle() {
    this.Toggledata = !this.Toggledata;
  }
}
