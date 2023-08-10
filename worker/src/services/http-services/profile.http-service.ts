import { Context } from '../../config';
import { User } from '../../models';

export class ProfileHttpService {
  static async updateAsync(ctx: Context): Promise<Response> {
    try {
      const user: User = await ctx.req.json();

      //await IdentityService.updateProfileAsync(ctx, user);

      return ctx.text('', 204);
    } catch (e) {
      ctx.get('logger').trackException("An error occured trying to update the user's profile.", 'ProfileHttpService.updateAsync', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }
}
