import { Injectable, Signal, inject, signal } from '@angular/core';
import { DataServiceFactory } from '@wbs/core/data-services';
import { Invite, User } from '@wbs/core/models';
import { MembershipStore } from '@wbs/core/store';
import { InviteViewModel } from '@wbs/core/view-models';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class MembersSettingStore {
  private readonly data = inject(DataServiceFactory);
  private readonly membership = inject(MembershipStore).membership;

  private readonly _invites = signal<InviteViewModel[] | undefined>(undefined);
  private readonly _members = signal<User[] | undefined>(undefined);
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

  get members(): Signal<User[] | undefined> {
    return this._members;
  }

  get isLoading(): Signal<boolean> {
    return this._isLoading;
  }

  initialize(): void {
    const membership = this.membership();

    if (!membership) return;

    const org = membership.id;

    forkJoin({
      members: this.data.memberships.getMembershipUsersAsync(org),
      invites: this.data.invites.getAsync(org, false),
    }).subscribe(({ members, invites }) => {
      this.setInvites(invites);

      this._members.set(
        members.map((m) => {
          return {
            ...m,
            roleList: m.roles.join(','),
          };
        })
      );
      const capacity = undefined; // membership.metadata?.seatCount;
      const remaining = capacity
        ? capacity - members.length - invites.length
        : undefined;

      this._capacity.set(capacity);
      this._remaining.set(remaining);
      this._canAdd.set(remaining === undefined || remaining > 0);
      this._isLoading.set(false);
    });
  }

  updateMember(member: User): void {
    this._members.update((members) => {
      if (!members) return [];

      const index = members.findIndex((m) => m.userId === member.userId);
      members[index] = member;
      return [...members];
    });
  }

  removeMember(memberId: string): void {
    this._members.update((members) => {
      if (!members) return [];

      const index = members.findIndex((m) => m.userId === memberId);
      members.splice(index, 1);
      return [...members];
    });
  }

  refreshInvites(): Observable<void> {
    return this.data.invites
      .getAsync(this.membership()!.id, false)
      .pipe(map((invites) => this.setInvites(invites)));
  }

  removeInvite(inviteId: string): void {
    this._invites.update((invites) => {
      if (!invites) return [];

      const index = invites.findIndex((i) => i.id === inviteId);
      invites.splice(index, 1);
      return [...invites];
    });
  }

  private setInvites(invites: Invite[]): void {
    this._invites.set(
      invites.map((i) => {
        return {
          ...i,
          roleList: i.roles.join(','),
        };
      })
    );
  }
}
