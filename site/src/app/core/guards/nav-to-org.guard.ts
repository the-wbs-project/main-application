import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { MembershipStore } from '@wbs/core/store';
import { first, skipWhile, tap } from 'rxjs/operators';

export const navToOrgGuard = () => {
  const membership = inject(MembershipStore);
  const store = inject(Store);

  return toObservable(membership.memberships).pipe(
    skipWhile((x) => x == undefined),
    first(),
    tap((orgs) => store.dispatch(new Navigate(['/', orgs![0].name, 'library'])))
  );
};
