import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { Organization } from '@wbs/core/models';
import { sorter } from '@wbs/core/services';
import { Observable, map } from 'rxjs';
import { DataServiceFactory } from '../data-services';

@Injectable({ providedIn: 'root' })
export class MembershipStore {
  private readonly data = inject(DataServiceFactory);
  private readonly _orgs = signal<Organization[] | undefined>(undefined);
  private readonly _org = signal<Organization | undefined>(undefined);
  private readonly _list = signal<Record<string, string[]> | undefined>(
    undefined
  );
  private readonly _roles = signal<string[] | undefined>(undefined);
  private userId?: string;

  get organization(): Signal<Organization | undefined> {
    return this._org;
  }

  get organizations(): Signal<Organization[] | undefined> {
    return this._orgs;
  }

  get orgRoleList(): Signal<Record<string, string[]> | undefined> {
    return this._list;
  }

  get roles(): Signal<string[] | undefined> {
    return this._roles;
  }

  get projectApprovalRequired(): Signal<boolean> {
    return computed(
      () => this.organization()?.metadata.projectApprovalRequired ?? false
    );
  }

  initializeAsync(userId: string): Observable<void> {
    this.userId = userId;

    return this.data.memberships.getMembershipsAsync().pipe(
      map((organizations) => {
        console.log(organizations);
        this._orgs.set(organizations.sort((a, b) => sorter(a.name, b.name)));
      })
    );
  }

  setOrganization(org: Organization): void {
    this._org.set(org);

    this.data.memberships
      .getMembershipRolesForUserAsync(org.name, this.userId!)
      .subscribe((roles) => {
        this._roles.set(roles);
      });
  }
}
