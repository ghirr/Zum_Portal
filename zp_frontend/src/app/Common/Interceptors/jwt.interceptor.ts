import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/feature-module/authentication/services/auth.service';
import { environment } from 'src/app/ENVIRONMENTS/environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // add auth header with jwt if user is logged in and request is to the api url
    const token = this.authenticationService.loadToken();
    const isLoggedIn = this.authenticationService.isLoggedIn();
    const isApiUrl = request.url.startsWith(environment.apiUrl);
    
    if (isLoggedIn && isApiUrl) {      
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request);
  }
}
