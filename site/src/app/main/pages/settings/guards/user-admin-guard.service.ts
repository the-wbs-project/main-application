import { inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoadUserData } from '../actions';

export const userAdminGuard = (): Observable<boolean> => {
  const store = inject(Store);
  
  return store.dispatch(new LoadUserData()).pipe(map(() => true));
}
