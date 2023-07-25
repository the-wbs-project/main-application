import { Injectable } from '@angular/core';

import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoadUserData } from '../actions';

@Injectable()
export class UserAdminGuard  {
  constructor(private readonly store: Store) {}

  canActivate(): Observable<boolean> {
    return this.store.dispatch(new LoadUserData()).pipe(map(() => true));
  }
}
