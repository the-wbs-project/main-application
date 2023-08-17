import { Context } from '../../config';
import { Member } from '../../models';

export class MembershipHttpService {
  static async getMembershipsAsync(ctx: Context): Promise<Response> {
    try {
      return ctx.json(await ctx.get('data').auth.getUserOrganizationsAsync(ctx.get('user').id));
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
      return ctx.json(await ctx.get('data').auth.getUserRolesAsync(ctx.get('user').id));
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

      if (!organization) return ctx.text('Missing Parameters', 400);

      return ctx.json(await ctx.get('data').auth.getUserOrganizationalRolesAsync(organization, ctx.get('user').id));
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

  static async removeUserFromOrganizationAsync(ctx: Context): Promise<Response> {
    try {
      const { organization, userId } = ctx.req.param();

      if (!organization || !userId) return ctx.text('Missing Parameters', 400);

      return ctx.json(await ctx.get('data').auth.removeUserFromOrganizationAsync(organization, userId));
    } catch (e) {
      ctx
        .get('logger')
        .trackException(
          'An error occured trying to delete this membership.',
          'MembershipHttpService.removeUserFromOrganizationAsync',
          <Error>e,
        );

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async addUserOrganizationalRolesAsync(ctx: Context): Promise<Response> {
    try {
      const { organization, userId } = ctx.req.param();

      if (!organization || !userId) return ctx.text('Missing Parameters', 400);

      return ctx.json(await ctx.get('data').auth.addUserOrganizationalRolesAsync(organization, userId, await ctx.req.json()));
    } catch (e) {
      ctx
        .get('logger')
        .trackException(
          'An error occured trying to add roles for this membership.',
          'MembershipHttpService.addUserOrganizationalRolesAsync',
          <Error>e,
        );

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async removeUserOrganizationalRolesAsync(ctx: Context): Promise<Response> {
    try {
      const { organization, userId } = ctx.req.param();

      if (!organization || !userId) return ctx.text('Missing Parameters', 400);

      return ctx.json(await ctx.get('data').auth.removeUserOrganizationalRolesAsync(organization, userId, await ctx.req.json()));
    } catch (e) {
      ctx
        .get('logger')
        .trackException(
          'An error occured trying to delete the roles for this membership.',
          'MembershipHttpService.removeUserOrganizationalRolesAsync',
          <Error>e,
        );

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async getMembershipUsersAsync(ctx: Context): Promise<Response> {
    try {
      const { organization } = ctx.req.param();

      if (!organization) return ctx.text('Missing Parameters', 400);

      const users = (await ctx.get('data').auth.getOrganizationalUsersAsync(organization)) ?? [];

      console.log('user count: ' + users.length);

      const roles: string[][] = await Promise.all(
        users.map((x) => ctx.get('data').auth.getUserOrganizationalRolesAsync(organization, x.id)),
      );

      const members: Member[] = [];

      for (let i = 0; i < users.length; i++) {
        members.push({
          ...users[i],
          roles: roles[i] ?? [],
        });
      }

      return ctx.json(members);
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
