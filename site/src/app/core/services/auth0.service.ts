import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import { Organization, User } from '@wbs/core/models';
import { Logger, Messages, sorter } from '@wbs/core/services';
import { InitiateOrganizations } from '@wbs/main/actions';
import { UserStore } from '@wbs/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

@UntilDestroy()
@Injectable({ providedIn: 'root' })
export class Auth0Service {
  private readonly _isInitiated = new BehaviorSubject<boolean>(false);
  constructor(
    private readonly auth: AuthService,
    private readonly data: DataServiceFactory,
    private readonly logger: Logger,
    private readonly messages: Messages,
    private readonly store: Store,
    private readonly userStore: UserStore
  ) {}

  get isInitiated(): Observable<boolean> {
    return this._isInitiated.asObservable();
  }

  initiate(): void {
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

      this.userStore.set(profile);
      this.logger.setGlobalContext({
        'usr.id': profile.id,
        'usr.name': profile.name,
        'usr.email': profile.email,
      });

      let organizations: Organization[] = user[ns + '/organizations'] ?? [];

      if (organizations.length > 0)
        this.store.dispatch([
          new InitiateOrganizations(
            organizations.sort((a, b) => sorter(a.name, b.name))
          ),
        ]);
      this._isInitiated.next(true);
    });
  }

  changeProfileName(name: string): Observable<any> {
    const originalProfile = this.userStore.profile()!;
    const originalName = originalProfile.name;

    const profile = { ...originalProfile, name };

    return this.data.users.putAsync(profile).pipe(
      tap(() => this.messages.notify.success('ProfileEditor.ProfileUpdated')),
      tap(() => this.userStore.set(profile)),
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
