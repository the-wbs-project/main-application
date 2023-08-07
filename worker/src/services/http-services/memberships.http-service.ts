import { Context } from '../../config';

export class MembershipHttpService {
  static async getMembershipsAsync(ctx: Context): Promise<Response> {
    try {
      return ctx.json(ctx.get('state').organizations);
    } catch (e) {
      ctx
        .get('logger')
        .trackException(
          'An error occured trying to get the organizations this user is a member of.',
          'MembershipHttpService.getOrganizationsAsync',
          <Error>e,
        );

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async getRolesAsync(ctx: Context): Promise<Response> {
    try {
      return ctx.json(ctx.get('state').roles);
    } catch (e) {
      ctx
        .get('logger')
        .trackException('An error occured trying to get the roles for this user.', 'MembershipHttpService.getOrganizationsAsync', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async getMembershipRolesAsync(ctx: Context): Promise<Response> {
    try {
      const { organization } = ctx.req.param();

      return ctx.json(ctx.get('state').organizationalRoles[organization] ?? []);
    } catch (e) {
      ctx
        .get('logger')
        .trackException(
          'An error occured trying to get the roles for this membership.',
          'MembershipHttpService.getOrganizationsAsync',
          <Error>e,
        );

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async getMembershipUsersAsync(ctx: Context): Promise<Response> {
    try {
      const { organization } = ctx.req.param();

      return ctx.json((await ctx.get('data').auth.getOrganizationalUsersAsync(organization)) ?? []);
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

  static async getMembershipRolesForUserAsync(ctx: Context): Promise<Response> {
    try {
      const { organization, userId } = ctx.req.param();

      return ctx.json((await ctx.get('data').auth.getUserOrganizationalRolesAsync(organization, userId)) ?? []);
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
}
