import { Context } from '../../config';
import {
  LIBRARY_PERMISSIONS,
  LIBRARY_ROLES,
  LIBRARY_ROLES_TYPE,
  ORGANZIATION_PERMISSIONS,
  PROJECT_PERMISSIONS,
  Permissions,
  ROLES,
} from '../../models';

export class ClaimsHttpService {
  static async getForOrganizationAsync(ctx: Context): Promise<Response> {
    try {
      const { organization } = ctx.req.param();
      const userId = ctx.var.idToken.userId;
      const membership = await ctx.var.data.memberships.getAsync(organization, userId);
      const roles = membership?.roles?.map((x) => x.name) ?? [];

      return ctx.json(ClaimsHttpService.getClaims(ORGANZIATION_PERMISSIONS, roles));
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to get claims for organization.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async getForProjectAsync(ctx: Context): Promise<Response> {
    try {
      const { owner, project } = ctx.req.param();
      const userId = ctx.get('idToken').userId;

      const [membership, projectObj, definitions] = await Promise.all([
        ctx.get('data').memberships.getAsync(owner, userId),
        ctx.get('data').projects.getByIdAsync(owner, project),
        ctx.get('data').roles.getAllAsync(),
      ]);

      const orgRoles = membership?.roles?.map((x) => x.name) ?? [];
      const roles =
        projectObj?.roles.map((pr) => definitions.find((d) => d.id === pr.role)!.name).filter((r) => orgRoles.includes(r)) ?? [];

      if (orgRoles.includes(ROLES.ADMIN)) roles.push(ROLES.ADMIN);

      return ctx.json(ClaimsHttpService.getClaims(PROJECT_PERMISSIONS, roles));
    } catch (e) {
      //@ts-ignore
      console.log(e.message);
      ctx.get('logger').trackException('An error occured trying to get claims for an entry.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async getForLibraryEntryAsync(ctx: Context): Promise<Response> {
    try {
      const { organization, owner, entry, version } = ctx.req.param();
      const userId = ctx.var.idToken.userId;
      const roles: LIBRARY_ROLES_TYPE[] = [LIBRARY_ROLES.VIEWER];

      if (organization === owner) {
        const model = await ctx.var.data.libraryVersions.getByIdAsync(owner, entry, parseInt(version));
        if (model?.author === userId) roles.push(LIBRARY_ROLES.OWNER);
        //if (model?.editors?.includes(userId)) roles.push(LIBRARY_ROLES.EDITOR);
      }

      return ctx.json(ClaimsHttpService.getClaims(LIBRARY_PERMISSIONS, roles));
    } catch (e) {
      //@ts-ignore
      console.log(e.message);
      ctx.get('logger').trackException('An error occured trying to get claims for project.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  private static getClaims(permissions: Permissions, roles: string[]) {
    const results: string[] = [];

    for (const key of Object.keys(permissions)) {
      const claimRoles = permissions[key];

      if (claimRoles.some((r) => roles.includes(r))) results.push(key);
    }
    return results;
  }
}
