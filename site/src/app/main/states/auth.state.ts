import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { Organization, UserLite } from '@wbs/core/models';
import { Logger, sorter } from '@wbs/core/services';
import { first } from 'rxjs/operators';
import { InitiateOrganizations } from '../actions';

export interface AuthBucket {
  culture: string;
  profile?: UserLite;
  roles?: string[];
}

@UntilDestroy()
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
  static displayName(state: AuthBucket): string | undefined {
    return state.profile?.name ?? state.profile?.email;
  }

  @Selector()
  static profileLite(state: AuthBucket): UserLite | undefined {
    return state.profile
      ? {
          id: state.profile.id,
          email: state.profile.email,
          name: state.profile.name,
        }
      : undefined;
  }

  @Selector()
  static roles(state: AuthBucket): string[] | undefined {
    return state?.roles;
  }

  @Selector()
  static userId(state: AuthBucket): string | undefined {
    return state?.profile?.id;
  }

  ngxsOnInit(ctx: StateContext<AuthBucket>): void {
    this.auth.idTokenClaims$.pipe(first()).subscribe((claims) => {
      const ns = 'http://www.pm-empower.com';
      let organizations: Organization[] = claims?.[ns + '/organizations'] ?? [];
      let orgRoles: Record<string, string[]> = claims?.[ns + '/orgRoles'] ?? [];
      let roles: string[] = claims?.[ns + '/orgRoles'] ?? [];

      organizations = organizations.sort((a, b) => sorter(a.name, b.name));

      ctx.patchState({ roles });

      if (organizations.length > 0)
        ctx.dispatch(new InitiateOrganizations(organizations, orgRoles));
    });

    this.auth.user$.pipe(untilDestroyed(this)).subscribe((userRaw) => {
      if (!userRaw) return;

      const raw = userRaw!;
      const profile = {
        email: raw['email']!,
        id: raw['sub']!,
        name: raw['name']!,
      };

      ctx.patchState({ profile });

      this.logger.setGlobalContext({
        'usr.id': profile.id,
        'usr.name': profile.name,
        'usr.email': profile.email,
      });
    });
  }

  private getNamespace(domain: string, property: string): string {
    return `http://${domain}.pm-empower.com/${property}`;
  }
}
