import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SwitcherService {
  private readonly emitChangeSource = new Subject<any>();
  private readonly emitHoverChangeSource = new Subject<any>();

  readonly changeEmitted = this.emitChangeSource.asObservable();
  readonly changeHoverEmitted = this.emitHoverChangeSource.asObservable();

  emitChange(change: any) {
    this.emitChangeSource.next(change);
  }

  emitHoverChange(change: any) {
    this.emitHoverChangeSource.next(change);
  }
}
