import { Component,ViewEncapsulation } from '@angular/core';
import { Router, Event as RouterEvent, NavigationStart } from '@angular/router';
import { CommonService } from './shared/common/common.service';
import { url } from './core/core.index';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,

}) 
export class AppComponent {
  title = 'template';
  base = '';
  page = '';
  last = '';

  constructor(
    private common: CommonService,
    private router: Router,
  ) {
    this.common.base.subscribe((res: string) => {
      this.base = res;
    });
    this.common.page.subscribe((res: string) => {
      this.page = res;
    });
    this.common.last.subscribe((res: string) => {
      this.last = res;
    });
    this.router.events.subscribe((data: RouterEvent) => {
      // console.log('base',this.base);
      // console.log('page',this.page);
      // console.log('last',this.last);
      if (data instanceof NavigationStart) {
        this.getRoutes(data);
      }
    })
  }

  public getRoutes(events: url) {
    const splitVal = events.url.split('/');
    this.common.base.next(splitVal[1]);
    this.common.page.next(splitVal[2]);
    this.common.last.next(splitVal[3]);
  }
}