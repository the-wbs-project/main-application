import { Injectable, inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DataServiceFactory } from '@wbs/core/data-services';
import { Logger } from '@wbs/core/services';
import { AiStore, MembershipStore, UserStore } from '@wbs/core/store';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { User } from '../models';

@UntilDestroy()
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
    return this._isInitiated.asObservable();
  }

  initiate(): void {
    this.auth.isAuthenticated$
      .pipe(untilDestroyed(this))
      .subscribe((isAuthenticated) => {
        if (!isAuthenticated) return;

        this.initializeData();
      });
  }

  saveProfile(profile: User): Observable<any> {
    const originalProfile = this.userStore.profile()!;

    return this.data.users.putAsync(profile).pipe(
      tap(() => {
        this.userStore.set(profile);
        this.aiStore.setUserInfo({
          id: profile.user_id,
          name: profile.name,
          avatarUrl: profile.picture,
        });
      }),
      switchMap(() =>
        this.data.activities.saveAsync(profile.user_id, [
          {
            action: 'profile-updated',
            data: {
              from: originalProfile,
              to: profile,
            },
            topLevelId: profile.user_id,
          },
        ])
      )
    );
  }

  private initializeData(): void {
    if (this._isInitiated.getValue()) return;

    forkJoin([
      this.data.users.getProfileAsync(),
      this.data.users.getSiteRolesAsync(),
    ]).subscribe(([profile, siteRoles]) => {
      if (!profile) return;

      this.aiStore.setUserInfo({
        id: profile.user_id,
        name: profile.name,
        avatarUrl: profile.picture,
      });
      this.userStore.set(profile);
      this.memberships.setRoles(siteRoles);
      this.logger.setGlobalContext({
        'usr.id': profile.user_id,
        'usr.name': profile.name,
        'usr.email': profile.email,
      });

      this.userStore.set(profile);
      this._isInitiated.next(true);
    });
  }
}
