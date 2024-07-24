import { Component, OnDestroy } from "@angular/core";
import {  UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { routes } from "src/app/core/helpers/routes/routes";
import { WebStorage } from "src/app/core/services/storage/web.storage";
import { PasswordStrengthValidator } from "../helpers/password-strength.validators";
import { mustMatch } from "../helpers/confirmPwd";
import { AuthService } from "../services/auth.service";
import { ToasterService } from "src/app/core/services/toaster/toaster.service";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent  {
  public isvalidconfirmpassword = false;
  public routes = routes;
  id : any;

  constructor(private route: ActivatedRoute, private router: Router,private authService:AuthService
              ,private toaster: ToasterService) {
    this.id = this.route.snapshot.paramMap.get("id");
  }


  form = new UntypedFormGroup(
    {
      password: new UntypedFormControl("", [
        Validators.required,
        Validators.minLength(8),
        PasswordStrengthValidator
      ]),
      confirmPassword: new UntypedFormControl("", [Validators.required])
    }
  );
  get f() {
    return this.form.controls;
  }

  resetPassword() {
    if ((this.form.value.password !== this.form.value.confirmPassword)) {
      this.isvalidconfirmpassword = true;
    } else {
      
      this.authService.updatePassword(this.id,this.form.value.password).subscribe(
        (res)=>{
          this.router.navigate([routes.login1])
          this.toaster.clearToast2('Password Updated!', 'Success');
          
        }
        )
      
    }
  }

}