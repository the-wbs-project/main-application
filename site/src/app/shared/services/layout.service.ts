import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  private readonly emitSidebarNofitSource = new Subject<any>();
  private readonly emitSwitcherSource = new Subject<any>();

  readonly SidebarNotifyChangeEmitted =
    this.emitSidebarNofitSource.asObservable();
  readonly SwitcherChangeEmitted = this.emitSwitcherSource.asObservable();

  emitSidebarNotifyChange(change: any) {
    this.emitSidebarNofitSource.next(change);
  }

  emitSwitcherChange(change: any) {
    this.emitSwitcherSource.next(change);
  }
}
