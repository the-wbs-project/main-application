import { Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '@auth0/auth0-angular';
import { NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { filter, tap } from 'rxjs/operators';
import { LoadOrganization } from '../actions';
import { ROLES, UserLite } from '../models';
import { Logger } from '../services';

export interface AuthBucket {
  culture: string;
  profile?: UserLite;
}

@Injectable()
@State<AuthBucket>({
  name: 'auth',
  defaults: {
    culture: 'en-US',
  },
})
export class AuthState implements NgxsOnInit {
  constructor(
    private readonly auth: AuthService,
    private readonly logger: Logger
  ) {}

  @Selector()
  static isAdmin(state: AuthBucket): boolean {
    return (state.profile?.roles ?? []).indexOf(ROLES.ADMIN) > -1;
  }

  @Selector()
  static profile(state: AuthBucket): UserLite | undefined {
    return state.profile;
  }

  @Selector()
  static fullName(state: AuthBucket): string | undefined {
    return state?.profile?.name;
  }

  @Selector()
  static userId(state: AuthBucket): string | null | undefined {
    return state?.profile?.id;
  }

  ngxsOnInit(ctx: StateContext<AuthBucket>): void {
    this.auth.user$
      .pipe(
        filter((x) => x != undefined),
        tap((userRaw) => {
          const organizations = Object.keys(
            userRaw!['http://thewbsproject.com/organizations']
          );
          const selected = organizations[0];
          const { culture, profile } = this.convert(selected, userRaw!);
          ctx.patchState({
            culture,
            profile,
          });

          this.logger.setGlobalContext({
            'usr.id': profile.id,
            'usr.name': profile.name,
            'usr.email': profile.email,
          });

          return ctx.dispatch(new LoadOrganization(organizations, selected));
        }),
        takeUntilDestroyed()
      )
      .subscribe();
  }

  private convert(
    org: string,
    raw: Record<string, any>
  ): { profile: UserLite; culture: string } {
    const orgInfo = raw['http://thewbsproject.com/organizations'];

    return {
      profile: {
        email: raw['email'],
        id: raw['sub'],
        name: raw['name'],
        roles: orgInfo[org],
      },
      culture: raw['http://thewbsproject.com/culture'],
    };
  }
}
