import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { of } from 'rxjs';
import { first, map, skipWhile, switchMap } from 'rxjs/operators';
import { ChangeOrganization } from '../../main/actions';
import { MembershipState } from '../../main/states';

export const orgGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);

  return store.select(MembershipState.organizations).pipe(
    skipWhile((list) => list == undefined),
    map((list) => list!),
    switchMap((list) => {
      if (list.length === 0) {
        return of(false);
      }
      const org =
        list.find((org) => org.name === route.params['org']) ?? list[0];

      return store.dispatch(new ChangeOrganization(org)).pipe(map(() => true));
    }),
    first()
  );
};
