import { inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { AuthState } from '@wbs/core/states';

export const adminGuard = () => {
  const store = inject(Store);

  return store.selectOnce(AuthState.isAdmin);
}
