import { Context } from '../../config';

export class RolesHttpService {
  static async getAllAsync(ctx: Context): Promise<Response> {
    try {
      return ctx.json(await ctx.var.data.roles.getAllAsync());
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to get roles.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }
}
