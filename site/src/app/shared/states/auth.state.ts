import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChangeAuthenticationFlag, ProfileUpdated } from '@wbs/shared/actions';
import { User } from '@wbs/shared/models';
import { DataServiceFactory } from '@wbs/shared/services';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { map, Observable } from 'rxjs';

export interface AuthBucket {
  isAuthenticated?: boolean;
  profile?: User | null | undefined;
  organization?: string | undefined;
}

@Injectable()
@State<AuthBucket>({
  name: 'auth',
  defaults: {},
})
export class AuthState implements NgxsOnInit {
  private readonly authFlag = 'isLoggedIn';

  constructor(private readonly data: DataServiceFactory) {}

  @Selector()
  static isAuthenticated(state: AuthBucket): boolean {
    return state.isAuthenticated ?? false;
  }

  @Selector()
  static profile(state: AuthBucket): User | null | undefined {
    return state.profile;
  }

  @Selector()
  static fullName(state: AuthBucket): string | null | undefined {
    return state?.profile?.fullName;
  }

  ngxsOnInit(ctx: StateContext<AuthBucket>): Observable<void> {
    const data = localStorage.getItem(this.authFlag);

    return this.data.auth.getCurrentAsync().pipe(
      map((profile) => {
        ctx.patchState({
          profile,
          organization: profile.appInfo.lastOrg,
          isAuthenticated: data ? JSON.parse(data) : false,
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
