import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AddUsers, LoadOrganization } from '../actions';
import { DataServiceFactory } from '../data-services';
import { UserLite } from '../models';

interface StateModel {}

@Injectable()
@State<StateModel>({
  name: 'organization',
  defaults: {},
})
export class OrganizationState {
  constructor(private readonly data: DataServiceFactory) {}

  @Action(LoadOrganization)
  loadOrganization(ctx: StateContext<StateModel>): Observable<void> {
    return this.data.users.getAllLiteAsync().pipe(
      map((users) => {
        ctx.dispatch(new AddUsers(users));
      })
    );
  }
}
