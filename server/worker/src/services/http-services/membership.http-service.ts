import { Context } from '../../config';

export class MembershipHttpService {
  static async getRolesAsync(ctx: Context): Promise<Response> {
    try {
      return ctx.json(await ctx.var.data.memberships.getRolesAsync());
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to get roles.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async getMembershipsAsync(ctx: Context): Promise<Response> {
    try {
      return ctx.json(await ctx.var.data.memberships.getMembershipsAsync(ctx.var.idToken.userId, false));
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to get the users memberships.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async clearMembershipsAsync(ctx: Context): Promise<Response> {
    try {
      ctx.var.data.memberships.clearMembershipsCache(ctx.var.idToken.userId);

      return ctx.newResponse(null, 204);
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to clear the users memberships from cache.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }
}
