import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { MembershipState } from './states';
import { LoaderModule } from '@progress/kendo-angular-indicators';

@UntilDestroy()
@Component({
  standalone: true,
  template: `<div class="w-100 text-center pd-t-200">
    <kendo-loader type="infinite-spinner" themeColor="primary" size="large" />
    <br />
    <br />
    <h1>Loading...</h1>
  </div>`,
  imports: [LoaderModule],
})
export class MainLoadingComponent implements OnInit {
  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.store
      .select(MembershipState.organization)
      .pipe(untilDestroyed(this))
      .subscribe((org) => {
        if (org)
          this.store.dispatch(
            new Navigate([
              '/',
              org.name,
              'projects',
              'list',
              'assigned',
              'active',
            ])
          );

        //
      });
  }
}
