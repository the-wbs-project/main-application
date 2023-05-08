import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { LoadOrganization } from '../actions';
import { User } from '../models';
import { Logger } from '../services';

export interface AuthBucket {
  roles?: string[];
  isAdmin: boolean;
  profile?: User | null;
  organization?: string;
}

@Injectable()
@State<AuthBucket>({
  name: 'auth',
  defaults: {
    isAdmin: false,
  },
})
export class AuthState implements NgxsOnInit {
  private readonly authFlag = 'isLoggedIn';

  constructor(
    private readonly auth: AuthService,
    private readonly logger: Logger
  ) {}

  @Selector()
  static isAdmin(state: AuthBucket): boolean {
    return state.isAdmin;
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
    this.auth.user$
      .pipe(
        map((userRaw) => this.convert(userRaw)),
        tap((profile) => {
          if (!profile) {
            ctx.patchState({
              isAdmin: false,
              organization: undefined,
              profile,
              roles: undefined,
            });
            return of();
          }
          const org = profile.appInfo.organizationRoles![0];

          ctx.patchState({
            isAdmin: org.roles.indexOf('admin') > -1,
            organization: org.organization,
            profile,
            roles: org.roles,
          });

          this.logger.setGlobalContext({
            'usr.id': profile.id,
            'usr.name': profile.name,
            'usr.email': profile.email,
          });

          return ctx.dispatch(new LoadOrganization(org.organization));
        }),
        takeUntilDestroyed()
      )
      .subscribe();
  }

  private convert(
    raw: Record<string, any> | null | undefined
  ): User | undefined {
    if (!raw) return undefined;

    return {
      email: raw['email'],
      id: raw['sub'],
      name: raw['name'],
      appInfo: {
        organizationRoles: [
          {
            organization: 'acme_engineering',
            roles:
              raw['http://thewbsproject.com/organizations']['acme_engineering'],
          },
        ],
      },
      userInfo: {
        culture: raw['http://thewbsproject.com/culture'],
      },
    };
  }
}
