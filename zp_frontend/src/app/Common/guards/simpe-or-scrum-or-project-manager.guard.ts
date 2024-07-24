import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/feature-module/authentication/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class SimpleOrScrumOrProject  {
  constructor(public router: Router,private authService:AuthService) {}

  canActivate(): boolean {
    const userRole=this.authService.getUser().role?.name
    if (!['Simple User','Scrum Master','Project Manager'].includes(userRole)) {
      this.router.navigate(['/404']);
      return false;
    }
    return true;
  }
}