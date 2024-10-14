import { Injectable, Signal, computed, signal } from '@angular/core';
import { Membership } from '@wbs/core/models';
import { sorter } from '@wbs/core/services';

@Injectable({ providedIn: 'root' })
export class MembershipStore {
  private readonly _memberships = signal<Membership[] | undefined>(undefined);
  private readonly _membership = signal<Membership | undefined>(undefined);
  private readonly _siteRoles = signal<string[] | undefined>(undefined);

  get membership(): Signal<Membership | undefined> {
    return this._membership;
  }

  get memberships(): Signal<Membership[] | undefined> {
    return this._memberships;
  }

  get siteRoles(): Signal<string[] | undefined> {
    return this._siteRoles;
  }

  get projectApprovalRequired(): Signal<boolean> {
    return computed(() => this.membership()?.projectApprovalRequired ?? false);
  }

  initialize(memberships: Membership[], siteRoles: string[]): void {
    this._memberships.set(memberships.sort((a, b) => sorter(a.name, b.name)));
    this._siteRoles.set(siteRoles);
  }

  setMembership(membership: Membership): void {
    this._membership.set(membership);
  }
}
