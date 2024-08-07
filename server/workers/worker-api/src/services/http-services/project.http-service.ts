import { Context } from '../../config';
import { Member } from '../../models';

export class ProjectHttpService {
  static async getUsersAsync(ctx: Context): Promise<Response> {
    try {
      const { owner, project } = ctx.req.param();

      const [projectRoles, members] = await Promise.all([
        ctx.var.data.projects.getRolesAsync(owner, project),
        ctx.var.data.memberships.getAllAsync(owner),
      ]);
      const map = new Map<string, string[]>();

      for (const role of projectRoles) {
        const roles = map.get(role.userId) ?? [];
        roles.push(role.role);
        map.set(role.userId, roles);
      }

      const results: Member[] = [];

      for (const userId of map.keys()) {
        const user = members.find((m) => m.user_id === userId);
        const roles = map.get(userId);

        if (user) {
          results.push({
            user_id: user.user_id,
            name: user.name,
            email: user.email,
            picture: user.picture,
            roles: user.roles.filter((r) => roles?.includes(r.id)),
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
