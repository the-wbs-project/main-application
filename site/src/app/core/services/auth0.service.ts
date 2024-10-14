import { Injectable, inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DataServiceFactory } from '@wbs/core/data-services';
import { User, UserProfile } from '@wbs/core/models';
import { Logger } from '@wbs/core/services';
import { AiStore, MembershipStore, UserStore } from '@wbs/core/store';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

@Injectable()
export class Auth0Service {
  private readonly aiStore = inject(AiStore);
  private readonly auth = inject(AuthService);
  private readonly data = inject(DataServiceFactory);
  private readonly logger = inject(Logger);
  private readonly memberships = inject(MembershipStore);
  private readonly userStore = inject(UserStore);

  private readonly _isInitiated = new BehaviorSubject<boolean>(false);

  get isInitiated(): Observable<boolean> {
    return this.auth.isAuthenticated$;
  }

  saveProfile(profile: UserProfile): Observable<any> {
    const originalProfile = this.userStore.profile()!;

    return this.data.users.putProfileAsync(profile).pipe(
      tap(() => {
        this.userStore.set(profile);
        this.aiStore.setUserInfo({
          id: profile.userId,
          name: profile.fullName,
          avatarUrl: profile.picture,
        });
      }),
      switchMap(() =>
        this.data.activities.postAsync('user', undefined, profile.userId, [
          {
            action: 'profile-updated',
            data: {
              from: originalProfile,
              to: profile,
            },
            topLevelId: profile.userId,
          },
        ])
      )
    );
  }

  initializeDataAsync(): Observable<void> {
    return forkJoin([
      this.data.users.getProfileAsync(),
      this.data.users.getSiteRolesAsync(),
      this.data.memberships.getMembershipsAsync(),
    ]).pipe(
      map(([profile, siteRoles, memberships]) => {
        if (!profile) return;

        this.aiStore.setUserInfo({
          id: profile.userId,
          name: profile.fullName,
          avatarUrl: profile.picture,
        });
        this.userStore.set(profile);
        this.memberships.initialize(memberships, siteRoles);
        this.logger.setGlobalContext({
          'usr.id': profile.userId,
          'usr.name': profile.fullName,
          'usr.email': profile.email,
        });

        this.userStore.set(profile);
        this._isInitiated.next(true);
      })
    );
  }
}
