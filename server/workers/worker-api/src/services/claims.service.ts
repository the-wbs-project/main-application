import { ContextLocal } from '../config';
import {
  LIBRARY_PERMISSIONS,
  LIBRARY_ROLES,
  LibraryEntryVersion,
  ORGANZIATION_PERMISSIONS,
  Permissions,
  Project,
  PROJECT_PERMISSIONS,
  ROLES,
} from '../models';
import { DataServiceFactory } from './data-services';

export class ClaimsService {
  constructor(private readonly ctx: ContextLocal) {}

  private get data(): DataServiceFactory {
    return this.ctx.var.data;
  }

  private get userId(): string {
    return this.ctx.var.idToken.userId;
  }

  async getForOrganizationAsync(organization: string): Promise<string[]> {
    const user = await this.data.users.getViewAsync(organization, this.userId, 'organization');
    const roles = user?.roles?.map((x) => x.name) ?? [];

    return this.getClaims(ORGANZIATION_PERMISSIONS, roles);
  }

  async getForProjectAsync(project: Project): Promise<string[]> {
    const [user, definitions] = await Promise.all([
      this.data.users.getViewAsync(project.owner, this.userId, 'organization'),
      this.data.roles.getAllAsync(),
    ]);

    const orgRoles = user?.roles?.map((x) => x.name) ?? [];
    const roles = project.roles.map((pr) => definitions.find((d) => d.id === pr.role)!.name).filter((r) => orgRoles.includes(r)) ?? [];

    if (orgRoles.includes(ROLES.ADMIN)) roles.push(ROLES.ADMIN);

    return this.getClaims(PROJECT_PERMISSIONS, roles);
  }

  async getForLibraryEntry(organization: string, owner: string, version: LibraryEntryVersion): Promise<string[]> {
    const roles = [LIBRARY_ROLES.VIEWER];

    if (organization === owner) {
      if (version.author === this.userId) roles.push(LIBRARY_ROLES.OWNER);
      if (version.editors?.includes(this.userId)) roles.push(LIBRARY_ROLES.EDITOR);
    }

    return this.getClaims(LIBRARY_PERMISSIONS, roles);
  }

  private getClaims(permissions: Permissions, roles: string[]) {
    const results: string[] = [];

    for (const key of Object.keys(permissions)) {
      const claimRoles = permissions[key];

      if (claimRoles.some((r) => roles.includes(r))) results.push(key);
    }
    return results;
  }
}
