import { Component, OnInit } from '@angular/core';
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
export class LoginComponent implements OnInit {
  constructor(
    private readonly auth: AuthService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const { organization, invitation } = this.route.snapshot.queryParams;

    this.auth.loginWithRedirect({
      authorizationParams: {
        organization,
        invitation,
      },
    });
  }
}
