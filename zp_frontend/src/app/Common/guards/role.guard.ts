import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from 'src/app/feature-module/authentication/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class roleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): boolean {
    const role = this.authService.getUser().role?.name;
    if (['Admin','Talent Management','General Manager'].includes(role)) {
      this.router.navigate(['/dashboard/admin']);
    } else {
      this.router.navigate(['/dashboard/employee']);
    }
    return false; // Prevent navigation to the current route
  }
}