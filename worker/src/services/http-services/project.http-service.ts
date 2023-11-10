import { Context } from '../../config';
import { ORGANZIATION_PERMISSIONS, PROJECT_PERMISSIONS, Permissions, ROLES } from '../../models';
import { UserRolesViewModel } from '../../view-models';

export class ProjectHttpService {
  static async getUsersAsync(ctx: Context): Promise<Response> {
    try {
      const { owner, project } = ctx.req.param();
      const projectRoles = await ctx.get('data').projects.getRolesAsync(owner, project);
      const map = new Map<string, string[]>();

      for (const role of projectRoles) {
        const roles = map.get(role.userId) ?? [];
        roles.push(role.role);
        map.set(role.userId, roles);
      }

      const results: UserRolesViewModel[] = [];

      for (const userId of map.keys()) {
        const user = await ctx.get('data').users.getAsync(userId);

        if (user) {
          results.push({
            id: user.id,
            name: user.name,
            email: user.email,
            picture: user.picture,
            roles: map.get(userId) ?? [],
          });
        }
      }

      return ctx.json(results);
    } catch (e) {
      //@ts-ignore
      console.log(e.message);
      ctx.get('logger').trackException('An error occured trying to get project users.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }
}
