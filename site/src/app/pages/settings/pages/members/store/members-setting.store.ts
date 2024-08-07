import { Injectable, Signal, inject, signal } from '@angular/core';
import { DataServiceFactory } from '@wbs/core/data-services';
import { Invite, Member, Organization } from '@wbs/core/models';
import { InviteViewModel } from '@wbs/core/view-models';
import { forkJoin } from 'rxjs';

@Injectable()
export class MembersSettingStore {
  private readonly data = inject(DataServiceFactory);

  private readonly _invites = signal<InviteViewModel[] | undefined>(undefined);
  private readonly _members = signal<Member[] | undefined>(undefined);
  private readonly _capacity = signal<number | undefined>(undefined);
  private readonly _remaining = signal<number | undefined>(undefined);
  private readonly _isLoading = signal<boolean>(true);
  private readonly _canAdd = signal<boolean>(false);

  get capacity(): Signal<number | undefined> {
    return this._capacity;
  }

  get remaining(): Signal<number | undefined> {
    return this._remaining;
  }

  get canAdd(): Signal<boolean> {
    return this._canAdd;
  }

  get invites(): Signal<InviteViewModel[] | undefined> {
    return this._invites;
  }

  get members(): Signal<Member[] | undefined> {
    return this._members;
  }

  get isLoading(): Signal<boolean> {
    return this._isLoading;
  }

  initialize(membership: Organization | undefined): void {
    if (!membership) return;

    const org = membership.name;

    forkJoin({
      members: this.data.memberships.getMembershipUsersAsync(org),
      invites: this.data.memberships.getInvitesAsync(org),
    }).subscribe(({ members, invites }) => {
      this._members.set(
        members.map((m) => {
          return {
            ...m,
            roleList: m.roles.join(','),
          };
        })
      );
      this._invites.set(
        invites.map((i) => {
          return {
            ...i,
            roleList: i.roles.join(','),
          };
        })
      );
      const capacity = membership.metadata?.seatCount;
      const remaining = capacity
        ? capacity - members.length - invites.length
        : undefined;

      this._capacity.set(capacity);
      this._remaining.set(remaining);
      this._canAdd.set(remaining === undefined || remaining > 0);
      this._isLoading.set(false);
    });
  }

  updateMember(member: Member): void {
    this._members.update((members) => {
      if (!members) return [];

      const index = members.findIndex((m) => m.user_id === member.user_id);
      members[index] = member;
      return [...members];
    });
  }

  removeMember(memberId: string): void {
    this._members.update((members) => {
      if (!members) return [];

      const index = members.findIndex((m) => m.user_id === memberId);
      members.splice(index, 1);
      return [...members];
    });
  }

  addInvites(invites: Invite[]): void {
    this._invites.update((list) => [
      ...invites.map((i) => ({
        ...i,
        roleList: i.roles.join(','),
      })),
      ...(list ?? []),
    ]);
  }

  removeInvite(inviteId: string): void {
    this._invites.update((invites) => {
      if (!invites) return [];

      const index = invites.findIndex((i) => i.id === inviteId);
      invites.splice(index, 1);
      return [...invites];
    });
  }
}
