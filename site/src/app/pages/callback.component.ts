import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { tap } from 'rxjs';

@Component({
  standalone: true,
  template: `<div class="w-100 text-center pd-t-200">
    <kendo-loader type="infinite-spinner" themeColor="primary" size="large" />
    <br />
    <br />
    <h1>Processing...</h1>
  </div>`,
  imports: [LoaderModule, RouterModule],
})
export class CallbackComponent {
  constructor(auth: AuthService, route: ActivatedRoute) {
    auth.error$
      .pipe(tap((x) => console.log(x)))
      //filter(
      //  (e) => e instanceof GenericError && e.error === 'login_required'
      //),
      //mergeMap(() => this.authService.loginWithRedirect())
      .subscribe();
  }
}
