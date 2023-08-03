import { Context } from '../../config';
import { Organization } from '../../models';
import { IdentityService } from '../auth-services';

export class MembershipHttpService {
  static async getAllForUserAsync(ctx: Context): Promise<Response> {
    try {
      const userId = ctx.get('state').user.id;
      const data = ctx.get('data');
      const memberships = await data.membership.getAllForUserAsync(userId);
      const organizations: Organization[] = [];

      for (const membership of memberships) organizations.push((await data.organization.getAsync(membership.organization))!);

      return ctx.json({ memberships, organizations });
    } catch (e) {
      ctx
        .get('logger')
        .trackException(
          'An error occured trying to get the memberships for the user.',
          'MembershipHttpService.getAllForUserAsync',
          <Error>e,
        );

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async getAllForOrganizationAsync(ctx: Context): Promise<Response> {
    try {
      const { owner } = ctx.req.param();
      const memberships = await ctx.get('data').membership.getAllForOrganizationAsync(owner);
      const emails = memberships?.map((m) => m.id) ?? [];
      const users = await IdentityService.getUsersByEmailAsync(ctx, emails);

      return ctx.json({ memberships, users });
    } catch (e) {
      ctx
        .get('logger')
        .trackException(
          'An error occured trying to get all memberships (and users) for an organization.',
          'MembershipHttpService.getAllForOrganizationAsync',
          <Error>e,
        );
      return ctx.text('Internal Server Error', 500);
    }
  }

  static async putAsync(ctx: Context): Promise<Response> {
    try {
      const { owner } = ctx.req.param();
      const membership = await ctx.req.json();

      if (membership.owner !== owner) return ctx.text('Forbidden', 403);

      await ctx.get('data').membership.putAsync(membership);

      return ctx.text('', 204);
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to save a membership.', 'MembershipHttpService.putAsync', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }
}
