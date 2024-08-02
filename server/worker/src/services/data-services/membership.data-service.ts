import { Context } from '../../config';
import { Membership, Organization, Role } from '../../models';
import { UserViewModel } from '../../view-models';

export class MembershipDataService {
  constructor(private readonly ctx: Context) {}

  async getRolesAsync(): Promise<Role[]> {
    let kvData = await this.ctx.env.KV_DATA.get<Role[]>('ROLES', 'json');

    if (kvData) return kvData;

    let data = await this.ctx.var.origin.getAsync<Role[]>('roles');

    if (data) this.ctx.executionCtx.waitUntil(this.ctx.env.KV_DATA.put('ROLES', JSON.stringify(data)));

    return data ?? [];
  }

  async getMembershipsAsync(userId: string, refresh: boolean): Promise<Membership[]> {
    const kvKey = `USERS|${userId}|MEMBERSHIPS`;

    if (!refresh) {
      const kvData = await this.ctx.env.KV_DATA.get<Membership[]>(kvKey, 'json');

      if (kvData) return kvData;
    }
    const orgs = await this.ctx.var.origin.getAsync<Organization[]>(`users/${userId}/memberships`);

    if (!orgs) return [];

    const roleCalls = orgs.map((org) => this.getOrganizationRolesAsync(userId, org.name));
    const roles = await Promise.all(roleCalls);
    const data: Membership[] = orgs.map((org, i) => ({
      id: org.id,
      name: org.name,
      displayName: org.displayName,
      roles: roles[i] ?? [],
      metadata: org.metadata,
    }));

    if (data) {
      this.ctx.executionCtx.waitUntil(
        this.ctx.env.KV_DATA.put(kvKey, JSON.stringify(data), {
          expirationTtl: 60 * 60 * 24 * 7,
        }),
      );
    }
    return data ?? [];
  }

  clearMembershipsCache(userId: string): void {
    this.ctx.executionCtx.waitUntil(this.ctx.env.KV_DATA.delete(`USERS|${userId}|MEMBERSHIPS`));
  }

  private getOrganizationRolesAsync(userId: string, orgId: string): Promise<string[] | undefined> {
    return this.ctx.var.origin.getAsync<string[]>(`organizations/${orgId}/members/${userId}/roles`);
  }
}
