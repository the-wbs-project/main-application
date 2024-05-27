import { Injectable, inject } from '@angular/core';
import { DataServiceFactory } from '@wbs/core/data-services';
import { Invite } from '@wbs/core/models';
import { Messages } from '@wbs/core/services';
import { MembershipStore } from '@wbs/core/store';
import { InviteViewModel, MemberViewModel } from '@wbs/core/view-models';
import { Observable, forkJoin } from 'rxjs';
import { MembersSettingStore } from '../store';

@Injectable()
export class MemberSettingsService {
  private readonly data = inject(DataServiceFactory);
  private readonly messages = inject(Messages);
  private readonly org = inject(MembershipStore).organization;
  private readonly store = inject(MembersSettingStore);

  removeMemberAsync(memberId: string): void {
    this.data.memberships
      .removeUserFromOrganizationAsync(this.org()!.name, memberId)
      .subscribe(() => {
        this.messages.notify.success('OrgSettings.MemberRemoved');
        this.store.removeMember(memberId);
      });
  }

  updateMemberRolesAsync(
    member: MemberViewModel,
    toAdd: string[],
    toRemove: string[]
  ): void {
    const calls: Observable<void>[] = [];

    if (toRemove.length > 0)
      calls.push(
        this.data.memberships.removeUserOrganizationalRolesAsync(
          this.org()!.name,
          member.id,
          toRemove
        )
      );

    if (toAdd.length > 0)
      calls.push(
        this.data.memberships.addUserOrganizationalRolesAsync(
          this.org()!.name,
          member.id,
          toAdd
        )
      );

    if (calls.length === 0) return;

    forkJoin(calls).subscribe(() => {
      this.messages.notify.success('OrgSettings.MemberRolesUpdated');
      this.store.updateMember(member);
    });
  }

  sendInvitesAsync(emails: string[], roles: string[], inviter: string): void {
    const saves: Observable<Invite>[] = [];

    for (const invitee of emails) {
      saves.push(
        this.data.memberships.sendInvitesAsync(this.org()!.name, {
          invitee,
          inviter,
          roles,
        })
      );
    }
    forkJoin(saves).subscribe((invites) => {
      this.messages.notify.success('OrgSettings.InvitesSent');
      this.store.addInvites(invites);
    });
  }

  cancelInviteAsync(inviteId: string): void {
    this.data.memberships
      .cancelInviteAsync(this.org()!.name, inviteId)
      .subscribe(() => {
        this.messages.notify.success('OrgSettings.InviteCancelled');
        this.store.removeInvite(inviteId);
      });
  }
}
