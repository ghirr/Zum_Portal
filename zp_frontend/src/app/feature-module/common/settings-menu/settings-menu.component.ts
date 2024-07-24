import { Component } from '@angular/core';
import { SideBarService } from 'src/app/core/core.index';

@Component({
  selector: 'app-settings-menu',
  templateUrl: './settings-menu.component.html',
  styleUrls: ['./settings-menu.component.scss'],
})
export class SettingsMenuComponent {
  public showSettings = false;
  public layoutPosition = '1';
  public layoutColor = '1';
  public layoutWidth = '1';
  public layoutTopColor = '1';
  public layoutSidebarColor = '1';
  public layoutPositionScroll = '1';
  public layoutSidebarSize = '1';
  public layoutSidebarView = '1';
  constructor(public sideBar: SideBarService) {
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
    // <* to check layout sidebar color *>
    this.sideBar.layoutSidebarColor.subscribe((res: string) => {
      this.layoutSidebarColor = res;
    });
    // <* to check layout topcolor *>
    this.sideBar.layoutTopColor.subscribe((res: string) => {
      this.layoutTopColor = res;
    });
     // <* to check layout positionscroll *>
     this.sideBar.layoutPositionScroll.subscribe((res: string) => {
      this.layoutPositionScroll = res;
    });
     // <* to check layout sidebarsize *>
     this.sideBar.layoutSidebarSize.subscribe((res: string) => {
      this.layoutSidebarSize = res;
    });
     // <* to check layout sidebarview *>
     this.sideBar.layoutSidebarView.subscribe((res: string) => {
      this.layoutSidebarView = res;
    });
  }

  showSetting() {
    this.showSettings = false;
    this.sideBar.changeLayout('1'),
    this.sideBar.changeColors('1'),
    this.sideBar.changeWidth('1');
    this.sideBar.changeTopcolor('1'), 
    this.sideBar.changeSidebarColor('1'),
    this.sideBar.changepositionscroll('1'),
    this.sideBar.changeSidebarSize('1'),
    this.sideBar.changeSidebarView('1');
  }

  boxedLayout(): void {
    this.sideBar.changeWidth('2');
  }

  
}
