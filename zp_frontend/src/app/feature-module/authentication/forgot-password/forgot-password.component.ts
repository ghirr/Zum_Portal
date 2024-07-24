import { Component } from "@angular/core";
import {  UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { routes } from "src/app/core/helpers/routes/routes";
import { AuthService } from "../services/auth.service";
import { ToasterService } from "src/app/core/services/toaster/toaster.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
public routes = routes;
Error=false;
form = new UntypedFormGroup({
  email: new UntypedFormControl("", [Validators.required, Validators.email ,Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
});

constructor(private authService:AuthService,private toaster: ToasterService,private router:Router) { }
get f() {
  return this.form.controls;
}

submit() {
  this.authService.resetPassword(this.form.value).subscribe(
    (res)=>{
      this.router.navigate([routes.login1])
      this.toaster.clearToast2('Go verify your Email!', 'Success');
      
    },
    (error)=>{
      this.Error=true;
      
    }
    )
}
}

