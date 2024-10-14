import { inject } from '@angular/core';
import { Auth0Service } from '@wbs/core/services';
import { first, skipWhile, switchMap } from 'rxjs/operators';

export const authGuard = () => {
  const auth = inject(Auth0Service);

  return auth.isInitiated.pipe(
    skipWhile((x) => !x),
    switchMap(() => auth.initializeDataAsync()),
    first()
  );
};
