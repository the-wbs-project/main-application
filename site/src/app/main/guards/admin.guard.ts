import { inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { MembershipState, RolesState } from '@wbs/main/states';
import { skipWhile, switchMap } from 'rxjs/operators';

export const adminGuard = () => {
  const store = inject(Store);
  //
  //  We need to wait for the membership state to load before we can check the roles.
  //
  return store.select(MembershipState.loading).pipe(
    skipWhile((loading) => loading),
    switchMap(() => store.selectOnce(RolesState.isAdmin))
  );
};
