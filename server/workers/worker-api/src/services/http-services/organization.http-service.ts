import { Context } from '../../config';

export class OrganizationHttpService {
  static async getByNameAsync(ctx: Context): Promise<Response> {
    try {
      const { organization } = ctx.req.param();
      const data = ctx.var.data.organizations.getByNameAsync(organization);

      if (!data) return ctx.text('Not Found', 404);

      return ctx.json(data);
    } catch (e) {
      ctx.var.logger.trackException('An error occured trying to get an organization.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }
}
