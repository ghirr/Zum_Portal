import { Component, Input } from '@angular/core';

import { SideBarService } from 'src/app/core/services/side-bar/side-bar.service';
import { NavigationEnd, Router } from '@angular/router';
import { WebStorage } from 'src/app/core/services/storage/web.storage';
import { routes } from 'src/app/core/helpers/routes/routes';
import { AuthService } from 'src/app/feature-module/authentication/services/auth.service';
import { common } from 'src/app/Common/common';

@Component({
  selector: 'app-header-one',
  templateUrl: './header-one.component.html',
  styleUrls: ['./header-one.component.scss'],
})
export class HeaderOneComponent {
  public base = '';
  public page = '';
  public routes = routes;
  public miniSidebar = false;
  public baricon = false;
  image=common.profileImage
  @Input() selectedUser: any;
  constructor(
    private sideBar: SideBarService,
    private router: Router,private authService:AuthService,
  ) {
    this.sideBar.toggleSideBar.subscribe((res: string) => {
      if (res === 'true') {
        this.miniSidebar = true;
      } else {
        this.miniSidebar = false;
      }
    });
    router.events.subscribe((event: object) => {
      if (event instanceof NavigationEnd) {
        const splitVal = event.url.split('/');
        this.base = splitVal[1];
        this.page = splitVal[2];
        if (
          this.base === 'components' ||
          this.page === 'tasks' ||
          this.page === 'email'
        ) {
          this.baricon = false;
          localStorage.setItem('baricon', 'false');
        } else {
          this.baricon = true;
          localStorage.setItem('baricon', 'true');
        }
      }
    });
    if (localStorage.getItem('baricon') == 'true') {
      this.baricon = true;
    } else {
      this.baricon = false;
    }
  }
  getUser(){
   return this.authService.getUser();
  }
  public toggleSideBar(): void {
    this.sideBar.switchSideMenuPosition();
  }

  public togglesMobileSideBar(): void {
    this.sideBar.switchMobileSideBarPosition();
  }

  logout() {
   /* localStorage.removeItem('LoginData');
    this.router.navigate(['/login']);*/
    this.authService.logout();
    this.router.navigate([routes.login1])
  }
  // navigation() {
  //   this.router.navigate([routes.search]);
  // }
}
