import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import { Organization, User } from '@wbs/core/models';
import { Logger, Messages, sorter } from '@wbs/core/services';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { ChangeProfileName, InitiateOrganizations } from '../actions';

interface AuthBucket {
  profile?: User;
}

declare type Context = StateContext<AuthBucket>;

@UntilDestroy()
@Injectable()
@State<AuthBucket>({
  name: 'auth',
  defaults: {},
})
export class AuthState implements NgxsOnInit {
  constructor(
    private readonly auth: AuthService,
    private readonly data: DataServiceFactory,
    private readonly logger: Logger,
    private readonly messages: Messages
  ) {}

  @Selector()
  static displayName(state: AuthBucket): string | undefined {
    return state.profile?.name ?? state.profile?.email;
  }

  @Selector()
  static profile(state: AuthBucket): User | undefined {
    return state.profile;
  }

  @Selector()
  static userId(state: AuthBucket): string | undefined {
    return state?.profile?.id;
  }

  ngxsOnInit(ctx: Context): void {
    this.auth.user$.pipe(untilDestroyed(this)).subscribe((user) => {
      if (!user) return;

      const ns = 'http://www.pm-empower.com';
      const profile: User = {
        email: user['email']!,
        id: user['sub']!,
        name: user['name']!,
        picture: user['picture']!,
      };

      if (profile.email === profile.name) {
        profile.name = '';
      }

      ctx.patchState({ profile });

      this.logger.setGlobalContext({
        'usr.id': profile.id,
        'usr.name': profile.name,
        'usr.email': profile.email,
      });

      let organizations: Organization[] = user[ns + '/organizations'] ?? [];

      organizations = organizations.sort((a, b) => sorter(a.name, b.name));

      if (organizations.length > 0)
        ctx.dispatch([new InitiateOrganizations(organizations)]);
    });
  }

  @Action(ChangeProfileName)
  ChangeProfileName(
    ctx: Context,
    { name }: ChangeProfileName
  ): Observable<any> {
    const state = ctx.getState();
    const originalProfile = state.profile!;
    const originalName = originalProfile.name;

    const profile = { ...originalProfile, name };

    return this.data.users.putAsync(profile).pipe(
      tap(() => this.messages.notify.success('ProfileEditor.ProfileUpdated')),
      tap(() => ctx.patchState({ profile })),
      switchMap(() =>
        this.data.activities.saveAsync(profile.id, [
          {
            action: 'profile-name-updated',
            data: {
              from: originalName,
              to: name,
            },
            topLevelId: profile.id,
          },
        ])
      )
    );
  }
}
