import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { UserLite } from '@wbs/shared/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoadOrganization } from '../actions/organization.actions';
import { DataServiceFactory } from '../services';

interface StateModel {
  users: UserLite[];
}

@Injectable()
@State<StateModel>({
  name: 'organization',
  defaults: {
    users: [],
  },
})
export class OrganizationState {
  constructor(private readonly data: DataServiceFactory) {}

  @Selector()
  static users(state: StateModel): UserLite[] {
    return state.users;
  }

  @Action(LoadOrganization)
  loadOrganization(ctx: StateContext<StateModel>): Observable<void> {
    return this.data.users.getAllLiteAsync().pipe(
      map((users) => {
        ctx.patchState({ users });
      })
    );
  }
}
