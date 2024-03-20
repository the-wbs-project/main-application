import { Context } from '../../config';

export class OrganizationHttpService {
  static async getByNameAsync(ctx: Context): Promise<Response> {
    try {
      const { organization } = ctx.req.param();

      return ctx.json(await ctx.get('data').organizations.getNameAsync(organization));
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to get an organization.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }
}
