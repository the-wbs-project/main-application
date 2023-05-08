import { Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '@auth0/auth0-angular';
import { NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { filter, map, tap } from 'rxjs/operators';
import { LoadOrganization } from '../actions';
import { ROLES, UserLite } from '../models';
import { Logger } from '../services';

export interface AuthBucket {
  culture: string;
  organization: string;
  profile?: UserLite;
}

@Injectable()
@State<AuthBucket>({
  name: 'auth',
  defaults: {
    culture: 'en-US',
    organization: 'acme_engineering',
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
  static organization(state: AuthBucket): string | undefined {
    return state.organization;
  }

  @Selector()
  static userId(state: AuthBucket): string | null | undefined {
    return state?.profile?.id;
  }

  ngxsOnInit(ctx: StateContext<AuthBucket>): void {
    const organization = ctx.getState().organization;

    this.auth.user$
      .pipe(
        filter((x) => x != undefined),
        map((userRaw) => this.convert(organization, userRaw!)),
        tap(({ profile, culture }) => {
          ctx.patchState({
            culture,
            profile,
          });

          this.logger.setGlobalContext({
            'usr.id': profile.id,
            'usr.name': profile.name,
            'usr.email': profile.email,
          });

          return ctx.dispatch(new LoadOrganization(organization));
        }),
        takeUntilDestroyed()
      )
      .subscribe();
  }

  private convert(
    organization: string,
    raw: Record<string, any>
  ): { profile: UserLite; culture: string } {
    return {
      profile: {
        email: raw['email'],
        id: raw['sub'],
        name: raw['name'],
        roles: raw['http://thewbsproject.com/organizations'][organization],
      },
      culture: raw['http://thewbsproject.com/culture'],
    };
  }
}
