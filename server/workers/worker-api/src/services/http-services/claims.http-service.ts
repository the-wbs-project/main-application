import { Context } from '../../config';

export class ClaimsHttpService {
  static async getForOrganizationAsync(ctx: Context): Promise<Response> {
    try {
      const { organization } = ctx.req.param();

      return ctx.json(await ctx.var.claims.getForOrganizationAsync(organization, ctx.var.userId));
    } catch (e) {
      ctx.var.logger.trackException('An error occured trying to get claims for organization.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }
}
