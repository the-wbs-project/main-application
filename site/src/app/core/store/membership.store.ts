import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { DataServiceFactory } from '@wbs/core/data-services';
import { Organization, Role } from '@wbs/core/models';
import { OrganizationService, sorter } from '@wbs/core/services';
import { Observable, map, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MembershipStore {
  private readonly orgService = inject(OrganizationService);
  private readonly data = inject(DataServiceFactory);
  private readonly _memberships = signal<Organization[] | undefined>(undefined);
  private readonly _membership = signal<Organization | undefined>(undefined);
  private readonly _roles = signal<string[] | undefined>(undefined);

  get membership(): Signal<Organization | undefined> {
    return this._membership;
  }

  get memberships(): Signal<Organization[] | undefined> {
    return this._memberships;
  }

  get roles(): Signal<string[] | undefined> {
    return this._roles;
  }

  get projectApprovalRequired(): Signal<boolean> {
    return computed(
      () => this.membership()?.metadata?.projectApprovalRequired ?? false
    );
  }

  initializeAsync(): Observable<any> {
    if ((this.memberships() ?? []).length > 0) return of('nothing');

    return this.data.memberships.getMembershipsAsync().pipe(
      map((memberships) => {
        this._memberships.set(
          memberships.sort((a, b) => sorter(a.name, b.name))
        );

        //
        //  Add organization names to name cache
        //
        for (const m of memberships) {
          this.orgService.addOrganization(m.name, m.display_name);
        }
      })
    );
  }

  setMembership(membership: Organization): void {
    this._membership.set(membership);
  }

  setRoles(roles: Role[]): void {
    this._roles.set(roles.map((r) => r.name));
  }
}
