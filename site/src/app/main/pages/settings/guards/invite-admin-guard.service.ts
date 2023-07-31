import { inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoadInviteData } from '../actions';

export const inviteAdminGuard = (): boolean | Observable<boolean> => {
  const store = inject(Store);
  
  return store.dispatch(new LoadInviteData()).pipe(map(() => true));
}
