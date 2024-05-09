import { inject } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { first, skipWhile, tap } from 'rxjs/operators';
import { MembershipState } from '../../main/states';

export const navToOrgGuard = () => {
  const store = inject(Store);

  return store.select(MembershipState.organizations).pipe(
    skipWhile((x) => x == undefined),
    first(),
    tap((orgs) => store.dispatch(new Navigate(['/', orgs![0].name, 'library'])))
  );
};
