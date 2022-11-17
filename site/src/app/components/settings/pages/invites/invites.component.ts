import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { faPlus, faRefresh } from '@fortawesome/pro-solid-svg-icons';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngxs/store';
import {
  DataStateChangeEvent,
  GridDataResult,
} from '@progress/kendo-angular-grid';
import { process, State as kendoState } from '@progress/kendo-data-query';
import { Invite } from '@wbs/core/models';
import { BehaviorSubject, map } from 'rxjs';
import { ChangeBreadcrumbs, LoadInviteData } from '../../actions';
import { Breadcrumb } from '../../models';
import { UserAdminState } from '../../states';

@UntilDestroy()
@Component({
  templateUrl: './invites.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class InvitesComponent implements OnInit {
  private invites: Invite[] = [];
  private readonly crumbs: Breadcrumb[] = [
    {
      text: 'Settings.Invites',
    },
  ];

  readonly faPlus = faPlus;
  readonly faRefresh = faRefresh;
  readonly data$ = new BehaviorSubject<GridDataResult | null>(null);
  readonly isRefreshing$ = new BehaviorSubject<boolean>(false);
  readonly state$ = new BehaviorSubject<kendoState>({
    sort: [],
    skip: 0,
    take: 100,
    filter: {
      filters: [],
      logic: 'and',
    },
  });
  readonly filter$ = this.state$.pipe(map((s) => s.filter!));
  readonly sort$ = this.state$.pipe(map((s) => s.sort!));

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(new ChangeBreadcrumbs(this.crumbs));
    this.store
      .select(UserAdminState.invites)
      .pipe(untilDestroyed(this))
      .subscribe((invites) => {
        this.isRefreshing$.next(false);
        this.invites = invites ?? [];
        this.setData();
      });
  }

  dataStateChange(state: DataStateChangeEvent): void {
    this.state$.next(state);
    this.setData();
  }

  refresh(): void {
    this.isRefreshing$.next(true);
    this.store.dispatch(new LoadInviteData(true));
  }

  private setData() {
    this.data$.next(process(this.invites ?? [], this.state$.getValue()));
  }
}
