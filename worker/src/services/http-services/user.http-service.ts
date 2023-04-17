import { Context } from '../../config';
import { User } from '../../models';
import { IdentityService } from '../auth-services';

export class UserHttpService {
  static async getAllAsync(ctx: Context): Promise<Response> {
    try {
      return ctx.json(await IdentityService.getUsersAsync(ctx));
    } catch (e) {
      ctx
        .get('logger')
        .trackException('An error occured trying to get all users for the organization.', 'UserHttpService.getAllAsync', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async getAllLiteAsync(ctx: Context): Promise<Response> {
    try {
      return ctx.json(await IdentityService.getLiteUsersAsync(ctx));
    } catch (e) {
      ctx
        .get('logger')
        .trackException(
          'An error occured trying to get all lite verions of users for the organization.',
          'UserHttpService.getAllLiteAsync',
          <Error>e,
        );
      return ctx.text('Internal Server Error', 500);
    }
  }

  static async updateProfileAsync(ctx: Context): Promise<Response> {
    try {
      const user: User = await ctx.req.json();

      await IdentityService.updateProfileAsync(ctx, user);

      return ctx.text('', 204);
    } catch (e) {
      ctx
        .get('logger')
        .trackException("An error occured trying to update the logged in user's profile.", 'UserHttpService.updateProfileAsync', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async updateUserAsync(ctx: Context): Promise<Response> {
    try {
      const user: User = await ctx.req.json();

      await IdentityService.updateUserAsync(ctx, user);

      return ctx.text('', 204);
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to update the user.', 'UserHttpService.updateUserAsync', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }
}
