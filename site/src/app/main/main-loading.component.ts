import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { MembershipState } from './states';

@UntilDestroy()
@Component({
  standalone: true,
  template: '<div class="w-100 text-center pd-t-100">Loading...</div>',
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
