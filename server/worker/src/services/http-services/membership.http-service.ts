import { Context } from '../../config';
import { Organization } from '../../models';

export class MembershipHttpService {
  static async getOrganizationsAsync(ctx: Context): Promise<Response> {
    try {
      const resp = await ctx.var.origin.getAsync<Organization[]>(`users/${ctx.var.idToken.userId}/memberships`);
      return ctx.json(resp);
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to get the users memberships.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }
}
