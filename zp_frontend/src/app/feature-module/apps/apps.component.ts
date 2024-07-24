import { Component, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SideBarService } from 'src/app/core/core.index';

@Component({
  selector: 'app-apps',
  templateUrl: './apps.component.html',
  styleUrls: ['./apps.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppsComponent {
  public sidebarchat = false;
  public sidebarcall = false;
  public sidebarEmail = false;
  public base = '';
  public page = '';

  constructor(private router: Router, private sideBar: SideBarService) {
    router.events.subscribe((event: object) => {
      if (event instanceof NavigationEnd) {
        const splitVal = event.url.split('/');
        this.base = splitVal[1];
        this.page = splitVal[2];
        if (
          this.page === 'chats' ||
          this.page === 'voice-call' ||
          this.page === 'video-call' ||
          this.page === 'incoming-call' ||
          this.page === 'outgoing-call'
        ) {
          this.sidebarchat = true;
          localStorage.setItem('sidebarchat', 'true');
        } else {
          this.sidebarchat = false;
          localStorage.setItem('sidebarchat', 'false');
        }
        if (this.page === 'email' || this.page === 'compose') {
          this.sidebarEmail = true;
          localStorage.setItem('sidebarEmail', 'true');
        } else {
          this.sidebarEmail = false;
          localStorage.setItem('sidebarEmail', 'false');
        }
      }
    });
    if (localStorage.getItem('sidebarchat') === 'true') {
      this.sidebarchat = true;
    } else {
      this.sidebarchat = false;
    }
    if (localStorage.getItem('sidebarEmail') === 'true') {
      this.sidebarEmail = true;
    } else {
      this.sidebarEmail = false;
    }
  }
}
