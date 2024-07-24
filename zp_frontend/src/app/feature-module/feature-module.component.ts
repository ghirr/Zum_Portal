import { Component, ViewEncapsulation, OnDestroy } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import {
  DataService,
  routerlink,
  routes,
} from '../core/core.index';
import { SideBarService } from '../core/services/side-bar/side-bar.service';
import { CommonService } from '../shared/common/common.service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import {encryptStorage} from '../Common/encryptStorage'


@Component({
  selector: 'app-feature-module',
  templateUrl: './feature-module.component.html',
  styleUrls: ['./feature-module.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FeatureModuleComponent implements OnDestroy {
  public routes = routes;
  public authenticated = false;
  public miniSidebar = false;
  public expandMenu = false;
  public mobileSidebar = false;
  public showMiniSidebar = false;


  public layoutSidebarColor = '1';
  public layoutTopColor = '1';
  public layoutColor = '1';
  public layoutWidth = '1';
  public layoutPosition = '1';
  public layoutPositionScroll = '1';
  public layoutSidebarSize = '1';
  public layoutSidebarView = '1';
  public sidebarshow = false;
  public isAuthenticated = false;
  public secondSideBar = false;
  private _loading = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this._loading.asObservable();
  
  base = '';
  page = '';
  last = '';
  constructor(
    private sideBar: SideBarService,
    public router: Router,
    private data: DataService,
    private common: CommonService
  ) {
    this.getRoutes(this.router);
    router.events.subscribe((event: object) => {
      if (event instanceof NavigationEnd) {
        this.getRoutes(event);
        this.hideLoader();
        localStorage.removeItem('isMobileSidebar')
        this.mobileSidebar = false;
      }
      if (event instanceof NavigationStart) {
        this.getRoutes(event);
        this.showLoader();
      }
    });

    this.sideBar.toggleSideBar.subscribe((res: string) => {
      if (res === 'true') {
        this.miniSidebar = true;
      } else {
        this.miniSidebar = false;
      }
    });

    this.sideBar.toggleMobileSideBar.subscribe((res: string) => {
      if (res == 'true' || res == 'true') {
        this.mobileSidebar = true;
      } else {
        this.mobileSidebar = false;
      }
    });

    this.sideBar.expandSideBar.subscribe((res) => {
      this.expandMenu = res;
      if (res == false && this.miniSidebar == true) {
        this.data.sideBar.map((mainMenus) => {
          mainMenus.menu.map((resMenu) => {
            resMenu.showSubRoute = false;
          });
        });
      }
      if (res == true && this.miniSidebar == true) {
        this.data.sideBar.map((mainMenus) => {
          mainMenus.menu.map((resMenu) => {
            const menuValue = sessionStorage.getItem('menuValue');
            if (menuValue && menuValue == resMenu.menuValue) {
              resMenu.showSubRoute = true;
            } else {
              resMenu.showSubRoute = false;
            }
          });
        });
      }
    });
    // <* to check layout position *>
    this.sideBar.layoutPosition.subscribe((res: string) => {
      this.layoutPosition = res;
    });
    // <* to check layout colors *>
    this.sideBar.layoutColor.subscribe((res: string) => {
      this.layoutColor = res;
    });
    // <* to check layout width *>
    this.sideBar.layoutWidth.subscribe((res: string) => {
      this.layoutWidth = res;
    });
    // <* to check layout topcolor *>
    this.sideBar.layoutTopColor.subscribe((res: string) => {
      this.layoutTopColor = res;
    });
    // <* to check layout color *>
    this.sideBar.layoutSidebarColor.subscribe((res: string) => {
      this.layoutSidebarColor = res;
    });
    // <* to check layout position *>
    this.sideBar.layoutPositionScroll.subscribe((res: string) => {
      this.layoutPositionScroll = res;
    });
    // <* to check layout width *>
    this.sideBar.layoutSidebarSize.subscribe((res: string) => {
      this.layoutSidebarSize = res;
    });
    // <* to check layout view *>
    this.sideBar.layoutSidebarView.subscribe((res: string) => {
      this.layoutSidebarView = res;
    });
    if (window.innerWidth < 991) {
      this.sideBar.layoutPosition.next('1');
    }
    this.common.base.subscribe((res: string) => {
      this.base = res;
    });
    this.common.page.subscribe((res: string) => {
      this.page = res;
    });
    this.common.last.subscribe((res: string) => {
      this.last = res;
    });
    this.getRoutes(this.router);
  }

  ngOnDestroy(): void {
    sessionStorage.clear();
  }
  showLoader() {
    this._loading.next(true);
  }

  hideLoader() {
    setTimeout(() => {
      this._loading.next(false);
    }, 1200);
  }
  getRoutes(event: routerlink): void {
    const splitVal = event.url.split('/');
    this.common.base.next(splitVal[1]);
    this.common.page.next(splitVal[2]);
    this.common.last.next(splitVal[3]);
    if (encryptStorage.getItem('user')) {
      this.sidebarshow = true;
      this.isAuthenticated = true;
    } else {
      this.sidebarshow = false;
      this.isAuthenticated = false;
    }

    if (
      this.page === 'voice-call' ||
      this.page === 'chats' ||
      this.page === 'video-call' ||
      this.page === 'outgoing-call' ||
      this.page === 'incoming-call' ||
      this.base === 'components' ||
      this.page === 'company-settings' ||
      this.page === 'email' ||
      this.page === 'tasks' ||
      this.page === 'compose'
    ) {
      this.sidebarshow = false;
    }

    if (
      this.page === 'chats' ||
      this.base === 'components' ||
      this.page === 'tasks' ||
      this.page === 'email'
    ) {
      this.secondSideBar = true;
    } else {
      this.secondSideBar = false;
    }
    if (localStorage.getItem('logintime')) {
      const loginTime: string | number =
        localStorage.getItem('logintime') || Date();
      const timeDifference: number | string =
        Math.abs(new Date().getTime() - new Date(loginTime).getTime()) /
        10000 /
        60;
     /* if (timeDifference > 15) {
        localStorage.removeItem('LoginData');
        this.router.navigate(['/login']);
      }*/
    }
  }
}
