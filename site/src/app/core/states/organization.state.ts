import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AddUsers, LoadOrganization, LoadProjects } from '../actions';
import { DataServiceFactory } from '../data-services';
import { User, UserLite } from '../models';

interface StateModel {
  users?: User[];
}

@Injectable()
@State<StateModel>({
  name: 'organization',
  defaults: {},
})
export class OrganizationState {
  constructor(private readonly data: DataServiceFactory) {}

  @Action(LoadOrganization)
  loadOrganization(
    ctx: StateContext<StateModel>,
    action: LoadOrganization
  ): Observable<void> {
    return this.data.users.getAllAsync(action.organization).pipe(
      tap((users) => ctx.patchState({ users })),
      map((users) => {
        const lite: UserLite[] = [];

        for (const x of users)
          lite.push({
            email: x.email,
            id: x.id,
            name: x.name,
          });
        ctx.dispatch(new AddUsers(lite));
      }),
      tap(() => ctx.dispatch(new LoadProjects()))
    );
  }
}
