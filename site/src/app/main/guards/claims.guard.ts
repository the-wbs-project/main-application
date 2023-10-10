import { inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { ORGANIZATION_CLAIMS } from '@wbs/core/models';
import { MembershipState, PermissionsState } from '@wbs/main/states';
import { map, skipWhile, switchMap } from 'rxjs/operators';

const claimsGuard = (store: Store, claims: string | string[]) => {
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

export const settingsReadGuard = () => {
  return claimsGuard(inject(Store), [ORGANIZATION_CLAIMS.SETTINGS.READ]);
};
