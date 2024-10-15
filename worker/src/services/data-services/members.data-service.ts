import { Env } from '../../config';
import { OrganizationRole, RoleRollup, UserRole } from '../../models';
import { OriginService } from '../origin-services';
import { BaseDataService } from './base.data-service';

export class MembersDataService extends BaseDataService {
  private readonly listKey = 'MEMBER_ROLES';
  private readonly siteRoleKey = 'SITE_ROLES';

  constructor(env: Env, executionCtx: ExecutionContext, origin: OriginService) {
    super(env, executionCtx, origin);
  }

  async getMembershipsAsync(userId: string): Promise<RoleRollup> {
    return (await this.getKv<RoleRollup>(this.getKey(userId))) ?? {};
  }

  async getRolesAsync(organizationId: string, userId: string): Promise<string[]> {
    return (await this.getMemberRolesAsync(userId))[organizationId] ?? [];
  }

  async getMemberRolesAsync(organizationId: string): Promise<RoleRollup> {
    return (await this.getKv<RoleRollup>(this.getKey(organizationId))) ?? {};
  }

  async isMemberAsync(organizationId: string, userId: string): Promise<boolean> {
    const roles = await this.getMembershipsAsync(userId);

    return Object.keys(roles).some((x) => x === organizationId);
  }

  async getSiteRolesAsync(userId: string): Promise<string[]> {
    const roles = (await this.getKv<RoleRollup>(this.siteRoleKey)) ?? (await this.setupSiteRolesAsync());

    return roles[userId] ?? [];
  }

  async putRolesAsync(organizationId: string, userId: string, roles: string[]): Promise<void> {
    //
    //  Save to server
    //
    const resp = await this.origin.putAsync(roles, `members/${organizationId}/users/${userId}/roles`);

    if (resp.status >= 300) {
      throw new Error('An error occured trying to save user roles: ' + resp.status);
    }
    console.log(roles);
    //
    //  Save to KV
    //
    this.executionCtx.waitUntil(this.updateRolesInKv(organizationId, userId, roles));
  }

  async setupAsync(): Promise<void> {
    const list = await this.getAllAsync();

    this.createOrgs(list);
    this.createUsers(list);

    await this.setupSiteRolesAsync();
  }

  private async setupSiteRolesAsync(): Promise<RoleRollup> {
    const siteRoles = (await this.origin.getAsync<UserRole[]>('members/site-roles')) ?? [];
    const userIds = [...new Set(siteRoles.map((x) => x.userId))];
    const data: RoleRollup = {};

    for (const userId of userIds) {
      data[userId] = siteRoles.filter((x) => x.userId === userId).map((x) => x.role);
    }
    this.putKv('SITE_ROLES', data);

    return data;
  }

  async updateRolesInKv(organizationId: string, userId: string, roles: string[]): Promise<void> {
    const list = (await this.getKv<OrganizationRole[]>(this.listKey))!;
    const newList: OrganizationRole[] = [
      ...list.filter((x) => !(x.organizationId === organizationId && x.userId === userId)),
      ...roles.map((x) => ({ organizationId, userId, role: x })),
    ];

    this.putKv(this.listKey, newList);
    this.createOrgs(newList);
    this.createUsers(newList);
  }

  private async getAllAsync(): Promise<OrganizationRole[]> {
    const kvData = await this.getKv<OrganizationRole[]>(this.listKey);

    if (kvData) return kvData;

    const apiData = (await this.origin.getAsync<OrganizationRole[]>('members')) ?? [];

    if (apiData) this.putKv(this.listKey, apiData);

    return apiData;
  }

  private createOrgs(list: OrganizationRole[]): void {
    const orgIds = [...new Set(list.map((x) => x.organizationId))];

    for (const orgId of orgIds) {
      const data: RoleRollup = {};
      const orgList = list.filter((x) => x.organizationId === orgId);
      const userIds = [...new Set(orgList.map((x) => x.userId))];

      for (const userId of userIds) {
        data[userId] = [];

        for (const ur of orgList.filter((x) => x.userId === userId)) {
          data[userId].push(ur.role);
        }
      }
      this.putKv(this.getKey(orgId), data);
    }
  }

  private createUsers(list: OrganizationRole[]): void {
    const userIds = [...new Set(list.map((x) => x.userId))];

    for (const userId of userIds) {
      const data: RoleRollup = {};
      const userList = list.filter((x) => x.userId === userId);
      const orgIds = [...new Set(userList.map((x) => x.organizationId))];

      for (const orgId of orgIds) {
        data[orgId] = [];

        for (const ur of userList.filter((x) => x.organizationId === orgId)) {
          data[orgId].push(ur.role);
        }
      }
      this.putKv(this.getKey(userId), data);
    }
  }

  private getKey(orgId: string): string {
    return this.listKey + '|' + orgId;
  }
}
