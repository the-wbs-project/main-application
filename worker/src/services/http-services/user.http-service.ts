import { Context } from '../../config';

export class UserHttpService {
  static async getMembershipsAsync(ctx: Context): Promise<Response> {
    try {
      const members = await ctx.get('data').users.getMembershipsAsync(ctx.req.param('user'));

      return ctx.json(members);
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to get memberships', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async getRolesAsync(ctx: Context, next: any): Promise<Response | void> {
    try {
      const roles = await ctx.get('data').users.getRolesAsync(ctx.req.param('user'));

      return ctx.json(roles);
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to get site roles', <Error>e);

      ctx.status(500);

      await next();
    }
  }
}
