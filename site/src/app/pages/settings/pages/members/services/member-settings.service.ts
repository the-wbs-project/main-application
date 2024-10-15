import { Injectable, inject } from '@angular/core';
import { DataServiceFactory } from '@wbs/core/data-services';
import { Invite, User } from '@wbs/core/models';
import { IdService, Messages } from '@wbs/core/services';
import { MembershipStore, UserStore } from '@wbs/core/store';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { MembersSettingStore } from '../store';
import { InviteViewModel } from '@wbs/core/view-models';

@Injectable()
export class MemberSettingsService {
  private readonly data = inject(DataServiceFactory);
  private readonly membership = inject(MembershipStore).membership;
  private readonly messages = inject(Messages);
  private readonly store = inject(MembersSettingStore);
  private readonly profile = inject(UserStore).profile;

  removeMemberAsync(memberId: string): void {
    this.data.memberships
      .putUserRolesAsync(this.membership()!.id, memberId, [])
      .subscribe(() => {
        this.messages.notify.success('OrgSettings.MemberRemoved');
        this.store.removeMember(memberId);
      });
  }

  updateMemberRolesAsync(member: User, roles: string[]): void {
    this.data.memberships
      .putUserRolesAsync(this.membership()!.id, member.userId, roles)
      .subscribe(() => {
        this.messages.notify.success('OrgSettings.MemberRolesUpdated');

        member.roles = structuredClone(roles);

        this.store.updateMember(member);
      });
  }

  sendInvitesAsync(emails: string[], roles: string[]): Observable<void> {
    const organizationId = this.membership()!.id;
    const invitedById = this.profile()!.userId;
    //
    //  Don't do an array with forkJoin because we want them to be send one after another
    //

    let obs = this.sendInviteAsync(
      organizationId,
      invitedById,
      emails[0],
      roles
    );

    for (let i = 1; i < emails.length; i++) {
      obs = obs.pipe(
        switchMap(() =>
          this.sendInviteAsync(organizationId, invitedById, emails[i], roles)
        )
      );
    }

    return obs.pipe(
      tap(() => this.messages.notify.success('OrgSettings.InvitesSent')),
      switchMap(() => this.store.refreshInvites())
    );
  }

  cancelInviteAsync(userId: string): void {
    this.data.invites
      .cancelAsync(this.membership()!.id, userId)
      .subscribe(() => {
        this.messages.notify.success('OrgSettings.InviteCancelled');
        this.store.removeInvite(userId);
      });
  }

  resendInviteAsync(invite: InviteViewModel): void {
    this.data.invites.resendAsync(invite).subscribe(() => {
      invite.lastInviteSentDate = new Date();
      this.store.updateInvite(invite);
    });
  }

  private sendInviteAsync(
    organizationId: string,
    invitedById: string,
    email: string,
    roles: string[]
  ): Observable<void> {
    const inviteId = IdService.generate();

    return this.data.invites.createAsync({
      id: inviteId,
      email,
      organizationId,
      invitedById,
      roles,
    });
  }
}
