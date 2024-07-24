import {  Router } from '@angular/router';

export class errorGuard{
  constructor(public router: Router) {}

  canActivate() {
    this.router.navigate(['/404'])
    }
}
