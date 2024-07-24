import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { routes } from 'src/app/core/core.index';
import { AuthService } from 'src/app/feature-module/authentication/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceGuard  {
  constructor(private authService: AuthService,private router: Router) {}

  canActivate(): boolean {
    if (!this.authService.getUser()) {
      this.router.navigate([routes.login1])
      return false;
    }
    return true;
  }
}
