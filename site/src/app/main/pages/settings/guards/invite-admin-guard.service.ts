import { Injectable } from '@angular/core';

import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoadInviteData } from '../actions';

@Injectable()
export class InviteAdminGuard  {
  constructor(private readonly store: Store) {}

  canActivate(): Observable<boolean> {
    return this.store.dispatch(new LoadInviteData()).pipe(map(() => true));
  }
}
