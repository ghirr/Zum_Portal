import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from 'src/app/feature-module/authentication/services/auth.service';
import { routes } from 'src/app/core/core.index';
import { ToasterService } from 'src/app/core/services/toaster/toaster.service';
routes

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthService,private toaster:ToasterService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if (err.status==401) {
          this.authenticationService.logout();
        }
        if(err.status==403){
          this.toaster.typeError("Dont have Permissions","Error")
        }
        if (err.status==0) {
          this.toaster.typeError("Our Services Are Out","Error")
          this.authenticationService.logout();
        }
        if (!(['401','403','0','400'].includes(err.status))){
          
        }
        return throwError(err);
      })
    );
  }
}
