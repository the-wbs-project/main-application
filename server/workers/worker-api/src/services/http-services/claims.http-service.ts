import { Context } from '../../config';

export class ClaimsHttpService {
  static async getForOrganizationAsync(ctx: Context): Promise<Response> {
    try {
      return ctx.json(await ctx.var.claims.getForOrganizationAsync());
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to get claims for organization.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }
}
