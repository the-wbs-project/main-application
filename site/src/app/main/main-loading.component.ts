import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { first, skipWhile, tap } from 'rxjs/operators';
import { MembershipState } from './states';

@Component({
  standalone: true,
  template: `<div class="w-100 text-center pd-t-200">
    <kendo-loader type="infinite-spinner" themeColor="primary" size="large" />
    <br />
    <br />
    <h1>{{ 'General.Loading' | translate }}...</h1>
  </div>`,
  imports: [LoaderModule, TranslateModule],
})
export class MainLoadingComponent implements OnInit {
  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.store
      .select(MembershipState.organization)
      .pipe(
        skipWhile((x) => x == undefined),
        first(),
        tap((org) =>
          this.store.dispatch(new Navigate(['/', org!.name, 'projects']))
        )
      )
      .subscribe();
  }
}
