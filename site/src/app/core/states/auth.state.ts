import { Injectable } from '@angular/core';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { map, Observable } from 'rxjs';
import { DataServiceFactory } from '../data-services';
import {
  ChangeAuthenticationFlag,
  LoadProfile,
  ProfileUpdated,
} from '../actions';
import { User } from '../models';

export interface AuthBucket {
  roles?: string[];
  isAdmin: boolean;
  isAuthenticated: boolean;
  profile?: User | null;
  organization?: string;
}

@Injectable()
@State<AuthBucket>({
  name: 'auth',
  defaults: {
    isAdmin: false,
    isAuthenticated: false,
  },
})
export class AuthState implements NgxsOnInit {
  private readonly authFlag = 'isLoggedIn';

  constructor(private readonly data: DataServiceFactory) {}

  @Selector()
  static isAdmin(state: AuthBucket): boolean {
    return state.isAdmin;
  }

  @Selector()
  static isAuthenticated(state: AuthBucket): boolean {
    return state.isAuthenticated;
  }

  @Selector()
  static profile(state: AuthBucket): User | null | undefined {
    return state.profile;
  }

  @Selector()
  static fullName(state: AuthBucket): string | null | undefined {
    return state?.profile?.name;
  }

  @Selector()
  static organization(state: AuthBucket): string | undefined {
    return state.organization;
  }

  @Selector()
  static roles(state: AuthBucket): string[] {
    return state.roles ?? [];
  }

  @Selector()
  static userId(state: AuthBucket): string | null | undefined {
    return state?.profile?.id;
  }

  ngxsOnInit(ctx: StateContext<AuthBucket>): void {
    const authFlag = localStorage.getItem(this.authFlag);

    ctx.patchState({
      isAuthenticated: authFlag ? JSON.parse(authFlag) : false,
    });
  }

  @Action(LoadProfile)
  loadProfile(ctx: StateContext<AuthBucket>): Observable<void> {
    return this.data.auth.getCurrentAsync().pipe(
      map((profile) => {
        const org = profile.appInfo.organizationRoles![0];

        ctx.patchState({
          isAdmin: org.roles.indexOf('admin') > -1,
          organization: org.organization,
          profile,
          roles: org.roles,
        });
      })
    );
  }

  @Action(ChangeAuthenticationFlag)
  changeAuthenticationFlag(
    ctx: StateContext<AuthBucket>,
    action: ChangeAuthenticationFlag
  ): void {
    localStorage.setItem(this.authFlag, JSON.stringify(action.isAuthenticated));
    ctx.patchState({
      isAuthenticated: action.isAuthenticated,
    });
  }

  @Action(ProfileUpdated)
  profileUpdated(
    ctx: StateContext<AuthBucket>,
    action: ProfileUpdated
  ): Observable<void> | void {}
}
