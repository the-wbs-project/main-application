import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot } from '@angular/router';
import { MembershipStore } from '@wbs/core/store';
import { of } from 'rxjs';
import { first, map, skipWhile } from 'rxjs/operators';

export const orgGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(MembershipStore);

  return toObservable(store.memberships).pipe(
    skipWhile((list) => list == undefined),
    map((list) => list!),
    map((list) => {
      if (list.length === 0) {
        return of(false);
      }
      const org =
        list.find((org) => org.name === route.params['org']) ?? list[0];

      store.setMembership(org);

      return true;
    }),
    first()
  );
};
