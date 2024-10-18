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
    const roles = await this.data.members.getRolesAsync(organization, userId);

    return this.getClaims(ORGANZIATION_PERMISSIONS, roles);
  }

  async getForProjectAsync(project: Project, userId: string): Promise<string[]> {
    const orgRoles = await this.data.members.getRolesAsync(project.owner, userId);
    const roles = project.roles.filter((pr) => pr.userId === userId && orgRoles.includes(pr.role)).map((pr) => pr.role);

    if (orgRoles.includes(ROLES.ADMIN)) roles.push(ROLES.ADMIN);

    return this.getClaims(PROJECT_PERMISSIONS, roles);
  }

  async getForLibraryEntry(userId: string, organization: string, versionOwner: string, version: LibraryEntryVersion): Promise<string[]> {
    const roles = [LIBRARY_ROLES.VIEWER];

    if (organization === versionOwner) {
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
