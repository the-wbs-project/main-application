import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import { UserLite } from '@wbs/core/models';
import { Logger } from '@wbs/core/services';
import { filter, switchMap, tap } from 'rxjs/operators';
import { LoadOrganizations } from '../actions';

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
    private readonly data: DataServiceFactory,
    private readonly logger: Logger
  ) {}

  @Selector()
  static displayName(state: AuthBucket): string | undefined {
    return state.profile?.name ?? state.profile?.email;
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
    this.auth.user$
      .pipe(
        filter((x) => x != undefined),
        tap((userRaw) => {
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
        }),
        switchMap(() => this.data.memberships.getRolesAsync()),
        tap((roles) => ctx.patchState({ roles })),
        tap(() => ctx.dispatch(new LoadOrganizations())),
        untilDestroyed(this)
      )
      .subscribe();
  }
}
