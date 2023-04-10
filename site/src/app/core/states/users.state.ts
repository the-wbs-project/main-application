import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { DataServiceFactory } from '../data-services';
import { AddUsers } from '../actions';
import { UserLite } from '../models';

export interface StateModel {
  users: UserLite[];
  usersById: Map<string, UserLite>;
}

@Injectable()
@State<StateModel>({
  name: 'users',
  defaults: {
    users: [],
    usersById: new Map<string, UserLite>(),
  },
})
export class UsersState {
  constructor(private readonly data: DataServiceFactory) {}

  @Selector()
  static users(state: StateModel): UserLite[] {
    return state.users;
  }

  @Selector()
  static usersById(state: StateModel): Map<string, UserLite> {
    return state.usersById;
  }

  @Action(AddUsers)
  addUsers(ctx: StateContext<StateModel>, action: AddUsers): void {
    const state = ctx.getState();

    for (const user of action.users) {
      if (!state.usersById.has(user.id)) {
        state.users.push(user);
        state.usersById.set(user.id, user);
      }
    }
    ctx.setState(state);
  }
}
