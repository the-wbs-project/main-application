import { Context } from '../../config';
import { ORGANZIATION_PERMISSIONS, PROJECT_PERMISSIONS, Permissions, ROLES } from '../../models';

export class ClaimsHttpService {
  static async getForOrganizationAsync(ctx: Context): Promise<Response> {
    try {
      const { organization } = ctx.req.param();
      const definitions = await ctx.get('data').roles.getAsync();

      const roles = ctx.get('idToken').orgRoles[organization].map((r) => definitions.find((d) => d.id === r)?.name ?? '');

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
      const origin = ctx.get('origin');

      const definitions = await ctx.get('data').roles.getAsync();
      const projectRoles = (await origin.getAsync<{ role: string; userId: string }[]>(`projects/owner/${owner}/id/${project}/roles`)) ?? [];
      const orgRoleIds = ctx.get('idToken').orgRoles[owner];
      const orgRoleNames = orgRoleIds.map((r) => definitions.find((d) => d.id === r)?.name ?? '');
      const roles = projectRoles
        .filter((r) => r.userId === userId && orgRoleIds.includes(r.role))
        .map((r) => definitions.find((d) => d.id === r.role)!.name);

      if (orgRoleNames.includes(ROLES.ADMIN)) roles.push(ROLES.ADMIN);

      return ctx.json(ClaimsHttpService.getClaims(PROJECT_PERMISSIONS, roles));
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
