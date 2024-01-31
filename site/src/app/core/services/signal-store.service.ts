import { Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store as NgxsStore } from '@ngxs/store';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SignalStore {
  constructor(private readonly store: NgxsStore) {}

  select<T>(
    selector: (state: any, ...states: any[]) => T
  ): Signal<T | undefined> {
    //select<T = any>(selector: string | Type<any>): Observable<T>;
    //select<T>(selector: StateToken<T>): Observable<T> {
    return toSignal(this.store.select(selector));
  }

  selectSnapshot<T>(selector: (state: any, ...states: any[]) => T): T {
    return this.store.selectSnapshot(selector);
  }

  selectSignalSnapshot<T>(
    selector: (state: any, ...states: any[]) => T
  ): WritableSignal<T> {
    return signal<T>(this.store.selectSnapshot(selector));
  }

  dispatch(actionOrActions: any | any[]): Observable<any> {
    return this.store.dispatch(actionOrActions);
  }
}
