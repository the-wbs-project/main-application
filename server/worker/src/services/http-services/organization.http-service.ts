import { Context } from '../../config';

export class OrganizationHttpService {
  static async getByNameAsync(ctx: Context): Promise<Response> {
    try {
      const { organization } = ctx.req.param();
      const org = await ctx.get('data').organizations.getAsync(organization);

      if (!org) return ctx.text('Not Found', 404);

      return ctx.json(org?.displayName);
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to get an organization.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }
}
