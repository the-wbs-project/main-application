import { Context } from '../../config';
import { User } from '../../models';

export class UserHttpService {
  static async getUserAsync(ctx: Context): Promise<Response> {
    try {
      const { organization, user } = ctx.req.param();
      const isMember = await ctx.var.data.users.isMemberAsync(organization, user);

      return ctx.json(await ctx.var.data.users.getViewAsync(organization, user, isMember ? 'organization' : 'public'));
    } catch (e) {
      ctx.var.logger.trackException("An error occured trying to get a user's information.", <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async getProfileAsync(ctx: Context): Promise<Response> {
    try {
      const user = ctx.var.idToken.userId;

      return ctx.json(await ctx.var.data.users.getProfileAsync(user));
    } catch (e) {
      ctx.var.logger.trackException("An error occured trying to get a user's site roles.", <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async getSiteRolesAsync(ctx: Context): Promise<Response> {
    try {
      const user = ctx.var.idToken.userId;

      return ctx.json(await ctx.var.data.users.getSiteRolesAsync(user));
    } catch (e) {
      ctx.var.logger.trackException("An error occured trying to get a user's site roles.", <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async getMembershipsAsync(ctx: Context): Promise<Response> {
    try {
      const user = ctx.var.idToken.userId;

      return ctx.json(await ctx.var.data.users.getMembershipsAsync(user));
    } catch (e) {
      ctx.var.logger.trackException("An error occured trying to get a user's site memberships.", <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async updateAsync(ctx: Context): Promise<Response> {
    try {
      const user = ctx.var.idToken.userId;
      const body: User = await ctx.req.json();

      if (body?.user_id !== user) return ctx.text('Bad Request', 400);

      await ctx.var.data.users.updateAsync(body);

      return ctx.newResponse(null, 204);
    } catch (e) {
      ctx.var.logger.trackException('An error occured trying to update a user profile.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }
}
