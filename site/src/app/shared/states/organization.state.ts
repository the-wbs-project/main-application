import { Injectable } from '@angular/core';
import { NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { User } from '@wbs/shared/models';

interface StateModel {
  users: User[];
}

@Injectable()
@State<StateModel>({
  name: 'organization',
  defaults: {
    users: [],
  },
})
export class OrganizationState implements NgxsOnInit {
  @Selector()
  static users(state: StateModel): User[] {
    return state.users;
  }

  ngxsOnInit(ctx: StateContext<StateModel>): void {
    ctx.patchState({
      users: [
        {
          id: 'auth0-cw',
          email: 'chrisw@thewbsproject.com',
          name: 'Christopher Walton',
          appInfo: {
            organizationRoles: [
              { organization: 'acme_engineering', roles: ['pm'] },
            ],
            inviteCode: '1234',
          },
          userInfo: {
            culture: 'en',
          },
        },
        {
          id: 'auth0-bh',
          email: 'billh@thewbsproject.com',
          name: 'Bill Hinsley',
          appInfo: {
            organizationRoles: [
              { organization: 'acme_engineering', roles: ['sme'] },
            ],
            inviteCode: '1234',
          },
          userInfo: {
            culture: 'en',
          },
        },
      ],
    });
  }
}
