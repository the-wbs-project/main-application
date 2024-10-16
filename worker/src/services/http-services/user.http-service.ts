import { Context } from '../../config';
import { UserProfile } from '../../models';

export class UserHttpService {
  static async getProfileAsync(ctx: Context): Promise<Response> {
    try {
      const user = ctx.var.userId;

      return ctx.json(await ctx.var.data.users.getUserAsync(user, true));
    } catch (e) {
      ctx.var.logger.trackException("An error occured trying to get a user's profile.", <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async updateAsync(ctx: Context): Promise<Response> {
    try {
      const user = ctx.var.userId;
      const body: UserProfile = await ctx.req.json();

      if (body?.userId !== user) return ctx.text('Bad Request', 400);

      await ctx.var.data.users.putAsync(body);

      return ctx.newResponse(null, 204);
    } catch (e) {
      ctx.var.logger.trackException('An error occured trying to update a user profile.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }
}
