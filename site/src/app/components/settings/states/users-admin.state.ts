import { Injectable } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { RouterDataResolved } from '@ngxs/router-plugin';
import {
  Action,
  Actions,
  NgxsOnInit,
  ofActionSuccessful,
  Selector,
  State,
  StateContext,
  Store,
} from '@ngxs/store';
import { Invite, User } from '@wbs/shared/models';
import { DataServiceFactory } from '@wbs/shared/services';
import { forkJoin, map, Observable } from 'rxjs';
import { LoadUserAdminData } from '../actions';

interface StateModel {
  invites?: Invite[];
  users?: User[];
}

@Injectable()
@UntilDestroy()
@State<StateModel>({
  name: 'userAdmin',
  defaults: {},
})
export class UserAdminState implements NgxsOnInit {
  constructor(private readonly data: DataServiceFactory) {}

  @Selector()
  static invites(state: StateModel): Invite[] | undefined {
    return state.invites;
  }

  @Selector()
  static users(state: StateModel): User[] | undefined {
    return state.users;
  }

  ngxsOnInit(ctx: StateContext<StateModel>) {}

  @Action(LoadUserAdminData)
  loadUserAdminData(
    ctx: StateContext<StateModel>,
    action: LoadUserAdminData
  ): Observable<void> | void {
    const state = ctx.getState();

    if (state.users != null && state.invites != null && !action.force) return;

    return forkJoin({
      invites: this.data.invites.getAllAsync(),
      users: this.data.users.getAllAsync(),
    }).pipe(
      map((data) => {
        ctx.patchState({
          invites: data.invites,
          users: data.users,
        });
      })
    );
  }
}
