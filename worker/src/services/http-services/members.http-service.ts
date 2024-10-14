import { Context } from '../../config';
import { Membership } from '../../models';
import { Transformers } from '../transformers';

export class MembersHttpService {
  static async setupAsync(ctx: Context): Promise<Response> {
    try {
      await ctx.var.data.members.setupAsync();

      return ctx.newResponse(null, 204);
    } catch (e) {
      ctx.var.logger.trackException('An error occured trying to setup the memberships.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async getMembershipsAsync(ctx: Context): Promise<Response> {
    try {
      const user = ctx.var.userId;
      //
      //  This gets a set of data
      //
      const [roles, organizations] = await Promise.all([
        ctx.var.data.members.getMembershipsAsync(user),
        ctx.var.data.organizations.getAllAsync(),
      ]);

      const memberships: Membership[] = [];

      for (const orgId of Object.keys(roles)) {
        const org = organizations.find((x) => x.id === orgId);

        if (!org) continue;

        memberships.push({
          ...org,
          roles: roles[orgId],
        });
      }
      return ctx.json(memberships);
    } catch (e) {
      ctx.var.logger.trackException("An error occured trying to get a user's memberships.", <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async getAllAsync(ctx: Context): Promise<Response> {
    try {
      const { organization } = ctx.req.param();

      var roles = await ctx.var.data.members.getMemberRolesAsync(organization);
      var userIds = Object.keys(roles);
      var users = await ctx.var.data.users.getUsersAsync(userIds);

      return ctx.json(Transformers.member.toViewModelList(users, roles));
    } catch (e) {
      ctx.var.logger.trackException('An error occured trying to get all the members of the organization.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async getSiteRolesAsync(ctx: Context): Promise<Response> {
    try {
      const userId = ctx.var.userId;

      return ctx.json(await ctx.var.data.members.getSiteRolesAsync(userId));
    } catch (e) {
      ctx.var.logger.trackException('An error occured trying to get site roles.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async putAsync(ctx: Context): Promise<Response> {
    try {
      const { organization, userId } = ctx.req.param();
      const roles: string[] = await ctx.req.json();

      await ctx.var.data.members.putRolesAsync(organization, userId, roles);

      return ctx.newResponse(null, 204);
    } catch (e) {
      ctx.var.logger.trackException('An error occured trying to update user roles.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }
}
