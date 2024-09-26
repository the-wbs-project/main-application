import { Injectable, inject } from '@angular/core';
import { DataServiceFactory } from '@wbs/core/data-services';
import { Invite } from '@wbs/core/models';
import { Messages } from '@wbs/core/services';
import { MembershipStore, MetadataStore, UserStore } from '@wbs/core/store';
import { UserViewModel } from '@wbs/core/view-models';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { MembersSettingStore } from '../store';

@Injectable()
export class MemberSettingsService {
  private readonly data = inject(DataServiceFactory);
  private readonly membership = inject(MembershipStore).membership;
  private readonly messages = inject(Messages);
  private readonly metadata = inject(MetadataStore);
  private readonly store = inject(MembersSettingStore);
  private readonly profile = inject(UserStore).profile;

  removeMemberAsync(memberId: string): void {
    this.data.memberships
      .removeUserFromOrganizationAsync(this.membership()!.name, memberId)
      .subscribe(() => {
        this.messages.notify.success('OrgSettings.MemberRemoved');
        this.store.removeMember(memberId);
      });
  }

  updateMemberRolesAsync(
    member: UserViewModel,
    toAdd: string[],
    toRemove: string[]
  ): void {
    const calls: Observable<void>[] = [];

    if (toRemove.length > 0)
      calls.push(
        this.data.memberships.removeUserOrganizationalRolesAsync(
          this.membership()!.name,
          member.userId,
          toRemove
        )
      );

    if (toAdd.length > 0)
      calls.push(
        this.data.memberships.addUserOrganizationalRolesAsync(
          this.membership()!.name,
          member.userId,
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

  sendInvitesAsync(emails: string[], roles: string[]): Observable<void> {
    const saves: Observable<void>[] = [];
    const inviter = this.profile()!.name;

    for (const invitee of emails) {
      saves.push(
        this.data.memberships.sendInviteAsync(this.membership()!.name, {
          invitee,
          inviter,
          roles,
        })
      );
    }
    return forkJoin(saves).pipe(
      tap(() => this.messages.notify.success('OrgSettings.InvitesSent')),
      switchMap(() =>
        this.data.memberships.getInvitesAsync(this.membership()!.name)
      ),
      map((invites) => {
        this.store.addInvites(invites);
      })
    );
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
