import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { faPlus } from '@fortawesome/pro-solid-svg-icons';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateModule } from '@ngx-translate/core';
import { Select, Store } from '@ngxs/store';
import {
  DataStateChangeEvent,
  GridDataResult,
  GridModule,
} from '@progress/kendo-angular-grid';
import { process, State as kendoState } from '@progress/kendo-data-query';
import { RoleListPipe } from '@wbs/main/pipes/role-list.pipe';
import { BehaviorSubject, map, Observable, switchMap } from 'rxjs';
import { ChangeBreadcrumbs } from '../../actions';
import { UserActionsComponent } from '../../components/user-actions/user-actions.component';
import { Breadcrumb, UserViewModel } from '../../models';
import { UserAdminState } from '../../states';

@UntilDestroy()
@Component({
  standalone: true,
  templateUrl: './users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    GridModule,
    RoleListPipe,
    RouterModule,
    TranslateModule,
    UserActionsComponent,
  ],
})
export class UsersComponent implements OnInit {
  @Select(UserAdminState.activeUserCount) activeCount$!: Observable<number>;
  @Select(UserAdminState.inactiveUserCount) inactiveCount$!: Observable<number>;

  private users: UserViewModel[] = [];
  private readonly crumbs: Breadcrumb[] = [
    {
      text: 'General.Users',
    },
  ];

  readonly view$: Observable<string>;
  readonly data$ = new BehaviorSubject<GridDataResult | null>(null);
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

  readonly faPlus = faPlus;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly store: Store
  ) {
    this.view$ = route.params.pipe(map((x) => x['view']));
  }

  ngOnInit(): void {
    this.store.dispatch(new ChangeBreadcrumbs(this.crumbs));
    this.route.params
      .pipe(
        map((x) => x['view']),
        switchMap((view) =>
          this.store.select(
            view === 'active'
              ? UserAdminState.activeUsers
              : UserAdminState.inactiveUsers
          )
        ),
        untilDestroyed(this)
      )
      .subscribe((users) => {
        this.users = users ?? [];
        this.setData();
      });
  }

  dataStateChange(state: DataStateChangeEvent): void {
    this.state$.next(state);
    this.setData();
  }

  private setData() {
    this.data$.next(process(this.users ?? [], this.state$.getValue()));
  }
}
