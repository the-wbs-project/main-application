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
  constructor(private readonly data: DataServiceFactory) {}

  async getForOrganizationAsync(organization: string, userId: string): Promise<string[]> {
    const user = await this.data.users.getViewAsync(organization, userId, 'organization');
    const roles = user?.roles?.map((x) => x.name) ?? [];

    return this.getClaims(ORGANZIATION_PERMISSIONS, roles);
  }

  async getForProjectAsync(project: Project, userId: string): Promise<string[]> {
    const [user, definitions] = await Promise.all([
      this.data.users.getViewAsync(project.owner, userId, 'organization'),
      this.data.roles.getAllAsync(),
    ]);

    const orgRoles = user?.roles?.map((x) => x.name) ?? [];
    const roles = project.roles.map((pr) => definitions.find((d) => d.id === pr.role)!.name).filter((r) => orgRoles.includes(r)) ?? [];

    if (orgRoles.includes(ROLES.ADMIN)) roles.push(ROLES.ADMIN);

    return this.getClaims(PROJECT_PERMISSIONS, roles);
  }

  async getForLibraryEntry(organization: string, userId: string, owner: string, version: LibraryEntryVersion): Promise<string[]> {
    const roles = [LIBRARY_ROLES.VIEWER];

    if (organization === owner) {
      if (version.author === userId) roles.push(LIBRARY_ROLES.OWNER);
      if (version.editors?.includes(userId)) roles.push(LIBRARY_ROLES.EDITOR);
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
