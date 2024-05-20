import { Injectable } from '@angular/core';
import { DataServiceFactory } from '@wbs/core/data-services';
import { Invite, Member } from '@wbs/core/models';
import { Messages } from '@wbs/core/services';
import { Observable, forkJoin, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class MembershipAdminService {
  constructor(
    private readonly data: DataServiceFactory,
    private readonly messages: Messages
  ) {}

  removeMemberAsync(org: string, memberId: string): Observable<void> {
    return this.data.memberships
      .removeUserFromOrganizationAsync(org, memberId)
      .pipe(
        tap(() => this.messages.notify.success('OrgSettings.MemberRemoved'))
      );
  }

  updateMemberRolesAsync(
    org: string,
    member: Member,
    toAdd: string[],
    toRemove: string[]
  ): Observable<any> {
    const calls: Observable<void>[] = [];

    if (toRemove.length > 0)
      calls.push(
        this.data.memberships.removeUserOrganizationalRolesAsync(
          org,
          member.id,
          toRemove
        )
      );

    if (toAdd.length > 0)
      calls.push(
        this.data.memberships.addUserOrganizationalRolesAsync(
          org,
          member.id,
          toAdd
        )
      );

    if (calls.length === 0) return of();

    return forkJoin(calls).pipe(
      tap(() => this.messages.notify.success('OrgSettings.MemberRolesUpdated'))
    );
  }

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
}
