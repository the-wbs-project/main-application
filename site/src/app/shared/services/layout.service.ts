import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  //Sidebar Notification
  private emitSidebarNofitSource = new Subject<any>();
  SidebarNotifyChangeEmitted = this.emitSidebarNofitSource.asObservable();
  emitSidebarNotifyChange(change: any) {
    this.emitSidebarNofitSource.next(change);
  }
  //Sidebar
  private emitSwitcherSource = new Subject<any>();
  SwitcherChangeEmitted = this.emitSwitcherSource.asObservable();
  emitSwitcherChange(change: any) {
    this.emitSwitcherSource.next(change);
  }
}
