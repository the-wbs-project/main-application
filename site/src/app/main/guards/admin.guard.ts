import { inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { ROLES } from '@wbs/core/models';
import { MembershipState } from '@wbs/main/states';
import { map } from 'rxjs/operators';

export const adminGuard = () => {
  const store = inject(Store);

  return store
    .selectOnce(MembershipState.roles)
    .pipe(map((roles) => roles?.includes(ROLES.ADMIN) ?? false));
};
