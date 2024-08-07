import { Injectable, inject } from '@angular/core';
import { DataServiceFactory } from '@wbs/core/data-services';
import { Invite, Member } from '@wbs/core/models';
import { Messages } from '@wbs/core/services';
import { MembershipStore, MetadataStore } from '@wbs/core/store';
import { Observable, forkJoin } from 'rxjs';
import { MembersSettingStore } from '../store';

@Injectable()
export class MemberSettingsService {
  private readonly data = inject(DataServiceFactory);
  private readonly membership = inject(MembershipStore).membership;
  private readonly messages = inject(Messages);
  private readonly metadata = inject(MetadataStore);
  private readonly store = inject(MembersSettingStore);

  removeMemberAsync(memberId: string): void {
    this.data.memberships
      .removeUserFromOrganizationAsync(this.membership()!.name, memberId)
      .subscribe(() => {
        this.messages.notify.success('OrgSettings.MemberRemoved');
        this.store.removeMember(memberId);
      });
  }

  updateMemberRolesAsync(
    member: Member,
    toAdd: string[],
    toRemove: string[]
  ): void {
    const calls: Observable<void>[] = [];

    if (toRemove.length > 0)
      calls.push(
        this.data.memberships.removeUserOrganizationalRolesAsync(
          this.membership()!.name,
          member.user_id,
          toRemove
        )
      );

    if (toAdd.length > 0)
      calls.push(
        this.data.memberships.addUserOrganizationalRolesAsync(
          this.membership()!.name,
          member.user_id,
          toAdd
        )
      );

    if (calls.length === 0) return;

    forkJoin(calls).subscribe(() => {
      this.messages.notify.success('OrgSettings.MemberRolesUpdated');

      const roleIds = [
        ...member.roles
          .map((role) => role.id)
          .filter((id) => !toRemove.includes(id)),
        ...toAdd,
      ];

      const roles = this.metadata.roles.definitions.filter((role) =>
        roleIds.includes(role.id)
      );
      member.roles = structuredClone(roles);

      this.store.updateMember(member);
    });
  }

  sendInvitesAsync(emails: string[], roles: string[], inviter: string): void {
    const saves: Observable<Invite>[] = [];

    for (const invitee of emails) {
      saves.push(
        this.data.memberships.sendInvitesAsync(this.membership()!.name, {
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
      .cancelInviteAsync(this.membership()!.name, inviteId)
      .subscribe(() => {
        this.messages.notify.success('OrgSettings.InviteCancelled');
        this.store.removeInvite(inviteId);
      });
  }
}
