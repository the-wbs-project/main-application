import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { LoaderModule } from '@progress/kendo-angular-indicators';

@Component({
  standalone: true,
  template: `<div class="w-100 text-center pd-t-200">
    <kendo-loader type="infinite-spinner" themeColor="primary" size="large" />
    <br />
    <br />
    <h1>Redirecting...</h1>
  </div>`,
  imports: [LoaderModule, RouterModule],
})
export class LoginComponent {
  constructor(auth: AuthService, route: ActivatedRoute) {
    const { organization, invitation } = route.snapshot.queryParams;

    auth.loginWithRedirect({
      authorizationParams: {
        organization,
        invitation,
        redirect_uri: invitation ? undefined : window.location.toString(),
      },
    });
  }
}
