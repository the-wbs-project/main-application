import { Auth0Service } from '../api-services';
import { BaseDataService } from './base.data-service';

export class MembershipDataService extends BaseDataService {
  constructor(private readonly api: Auth0Service, kv: KVNamespace, ctx: ExecutionContext) {
    super(kv, ctx);
  }

  async getAllAsync(organizationId: string): Promise<string[]> {
    const key = this.key('ORGS', organizationId, 'MEMBERS');

    return this.getArrayAsync(key, () => this.api.memberships.getAllAsync(organizationId));
  }

  async addAsync(organizationId: string, members: string[]): Promise<void> {
    await this.api.memberships.addAsync(organizationId, members);

    this.deleteKvValues(organizationId, members);
  }

  async deleteAsync(organizationId: string, members: string[]): Promise<void> {
    await this.api.memberships.deleteAsync(organizationId, members);

    this.deleteKvValues(organizationId, members);
  }

  async addToRolesAsync(organizationId: string, userId: string, roles: string[]): Promise<void> {
    await this.api.memberships.addToRolesAsync(organizationId, userId, roles);

    this.deleteKvValues(organizationId, [userId]);
  }

  async deleteFromRolesAsync(organizationId: string, userId: string, roles: string[]): Promise<void> {
    await this.api.memberships.deleteFromRolesAsync(organizationId, userId, roles);

    this.deleteKvValues(organizationId, [userId]);
  }

  private deleteKvValues(organizationId: string, members: string[]): void {
    const keys: string[] = [this.key('ORGS', organizationId, 'MEMBERS')];

    for (const member of members) {
      keys.push(this.key('USERS', member, 'MEMBERSHIPS'));
    }
    this.deleteKv(...keys);
  }
}
