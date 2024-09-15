import { computed, Signal, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { SaveState } from '../models';

export class SaveService {
  private readonly _state = signal<SaveState>('ready');

  get state(): Signal<SaveState> {
    return this._state;
  }

  get isSaving(): Signal<boolean> {
    return computed(() => this._state() === 'saving');
  }

  call<T>(
    obs: Observable<T>,
    startDelay = 0,
    finishDelay = 5000
  ): Observable<T> {
    this._state.set('saving');

    return obs.pipe(
      delay(startDelay),
      tap(() => this._state.set('saved')),
      delay(finishDelay),
      tap(() => this._state.set('ready'))
    );
  }

  quickCall<T>(obs: Observable<T>): Observable<T> {
    this._state.set('saving');

    return obs.pipe(tap(() => this._state.set('ready')));
  }
}
