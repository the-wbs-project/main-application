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
      const definitions = await ctx.var.data.memberships.getRolesAsync();
      const memberships = await ctx.var.data.memberships.getMembershipsAsync(userId, false);
      const orgRoles = memberships.find((m) => m.name === organization)?.roles ?? [];
      const roles = orgRoles.map((r) => definitions.find((d) => d.id === r)?.name ?? '');

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

      const definitions = await ctx.var.data.memberships.getRolesAsync();
      const projectRoles = await ctx.get('data').projects.getRolesAsync(owner, project);
      const memberships = await ctx.var.data.memberships.getMembershipsAsync(userId, false);
      const orgRoles = memberships.find((m) => m.name === owner)?.roles ?? [];
      const orgRoleNames = orgRoles.map((r) => definitions.find((d) => d.id === r)?.name ?? '');
      const roles = projectRoles
        .filter((r) => r.userId === userId && orgRoles.includes(r.role))
        .map((r) => definitions.find((d) => d.id === r.role)!.name);

      if (orgRoleNames.includes(ROLES.ADMIN)) roles.push(ROLES.ADMIN);

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
      const { owner, entry } = ctx.req.param();
      const userId = ctx.get('idToken').userId;
      const model = await ctx.get('data').entries.getByIdAsync(owner, entry);
      const roles: LIBRARY_ROLES_TYPE[] = [LIBRARY_ROLES.VIEWER];

      if (model?.author === userId) roles.push(LIBRARY_ROLES.OWNER);
      //if (model?.editors?.includes(userId)) roles.push(LIBRARY_ROLES.EDITOR);

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
