import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { DataServiceFactory } from '@wbs/core/data-services';

@Component({
  standalone: true,
  template: `<div class="w-100 text-center pd-t-200">
    <kendo-loader type="infinite-spinner" themeColor="primary" size="large" />
    <br />
    <br />
    <h1>Logging Out...</h1>
  </div>`,
  imports: [LoaderModule],
})
export class LogoutComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly data = inject(DataServiceFactory);

  ngOnInit(): void {
    this.data.memberships
      .clearMembershipsAsync()
      .subscribe(() => this.auth.logout());
  }
}
