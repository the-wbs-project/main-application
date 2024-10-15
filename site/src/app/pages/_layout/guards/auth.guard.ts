import { inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Auth0Service } from '@wbs/core/services';
import { first, skipWhile, switchMap, tap } from 'rxjs/operators';

export const authGuard = () => {
  const auth = inject(Auth0Service);
  const auth0 = inject(AuthService);

  auth0.error$
    .pipe(tap((x) => console.log(x)))
    //filter(
    //  (e) => e instanceof GenericError && e.error === 'login_required'
    //),
    //mergeMap(() => this.authService.loginWithRedirect())
    .subscribe();

  return auth.isInitiated.pipe(
    skipWhile((x) => !x),
    switchMap(() => auth.initializeDataAsync()),
    first()
  );
};
