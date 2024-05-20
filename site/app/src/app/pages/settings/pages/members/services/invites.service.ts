import { Injectable, inject } from '@angular/core';
import { Messages } from '@wbs/core/services';
import { InviteViewModel } from '@wbs/core/view-models';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { DataServiceFactory } from '@wbs/core/data-services';
import { Invite } from '@wbs/core/models';

@Injectable()
export class InvitesService {
  private readonly data = inject(DataServiceFactory);
  private readonly messages = inject(Messages);

  sendInvitesAsync(
    org: string,
    emails: string[],
    roles: string[],
    inviter: string
  ): Observable<Invite[]> {
    const saves: Observable<Invite>[] = [];

    for (const invitee of emails) {
      saves.push(
        this.data.memberships.sendInvitesAsync(org, {
          invitee,
          inviter,
          roles,
        })
      );
    }
    return forkJoin(saves).pipe(
      tap(() => this.messages.notify.success('OrgSettings.InvitesSent'))
    );
  }

  cancelInviteAsync(org: string, invite: InviteViewModel): Observable<boolean> {
    return this.messages.confirm
      .show('General.Confirmation', 'OrgSettings.CancelInviteConfirm')
      .pipe(
        switchMap((answer) => {
          if (!answer) return of(false);

          return this.data.memberships.cancelInviteAsync(org, invite.id).pipe(
            tap(() =>
              this.messages.notify.success('OrgSettings.InviteCancelled')
            ),
            map(() => true)
          );
        })
      );
  }
}
