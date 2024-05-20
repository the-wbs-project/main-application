import { inject } from '@angular/core';
import { Auth0Service } from '@wbs/core/services';
import { first, skipWhile } from 'rxjs/operators';

export const authGuard = () => {
  const auth = inject(Auth0Service);

  auth.initiate();

  return auth.isInitiated.pipe(
    skipWhile((x) => !x),
    first()
  );
};
