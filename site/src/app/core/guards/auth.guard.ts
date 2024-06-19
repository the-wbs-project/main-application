import { inject } from '@angular/core';
import { Auth0Service } from '@wbs/core/services';
import { first, skipWhile, switchMap } from 'rxjs/operators';
import { MembershipStore, UserStore } from '../store';

export const authGuard = () => {
  const auth = inject(Auth0Service);
  const memberships = inject(MembershipStore);
  const userId = inject(UserStore).userId;

  auth.initiate();

  return auth.isInitiated.pipe(
    skipWhile((x) => !x),
    switchMap(() => memberships.initializeAsync(userId()!)),
    first()
  );
};
