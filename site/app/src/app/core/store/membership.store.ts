import { Injectable, Signal, computed, signal } from '@angular/core';
import { Organization } from '@wbs/core/models';
import { sorter } from '@wbs/core/services';

@Injectable({ providedIn: 'root' })
export class MembershipStore {
  private readonly _orgs = signal<Organization[] | undefined>(undefined);
  private readonly _org = signal<Organization | undefined>(undefined);
  private readonly _list = signal<Record<string, string[]> | undefined>(
    undefined
  );
  private readonly _roles = signal<string[] | undefined>(undefined);

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

  initialize(
    organizations: Organization[],
    orgList: Record<string, string[]>
  ): void {
    for (const org of organizations)
      if (org.metadata == undefined) org.metadata = {};
      else if (typeof org.metadata.projectApprovalRequired === 'string') {
        org.metadata.projectApprovalRequired =
          org.metadata.projectApprovalRequired === 'true';
      }

    this._orgs.set(organizations.sort((a, b) => sorter(a.name, b.name)));
    this._list.set(orgList);
  }

  setOrganization(org: Organization): void {
    this._org.set(org);
    this._roles.set(this._list()![org.name]);
  }
}
