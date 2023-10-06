import { inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { MembershipState, PermissionsState } from '@wbs/main/states';
import { map, skipWhile, switchMap } from 'rxjs/operators';

export const claimsGuard = (claims: string | string[]) => {
  const store = inject(Store);
  //
  //  We need to wait for the membership state to load before we can check the roles.
  //
  return store.select(MembershipState.loading).pipe(
    skipWhile((loading) => loading),
    switchMap(() => store.selectOnce(PermissionsState.claims)),
    map((userClaims) => {
      if (!userClaims) return false;

      if (typeof claims === 'string') return userClaims.includes(claims);

      for (const claim of claims) {
        if (userClaims.includes(claim)) return true;
      }
      return false;
    })
  );
};
