import { Context } from '../../config';

export class MembershipHttpService {
  static async getAllAsync(ctx: Context): Promise<Response> {
    try {
      const { organization } = ctx.req.param();

      return ctx.json(await ctx.var.data.memberships.getAllAsync(organization));
    } catch (e) {
      ctx.var.logger.trackException('An error occured trying to get all the members of the organization.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async addAsync(ctx: Context): Promise<Response> {
    try {
      const { organization } = ctx.req.param();
      const members: string[] = await ctx.req.json();

      await ctx.var.data.memberships.addAsync(organization, members);

      return ctx.newResponse(null, 204);
    } catch (e) {
      ctx.var.logger.trackException('An error occured trying to add a member to an organization', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async deleteAsync(ctx: Context): Promise<Response> {
    try {
      const { organization, user } = ctx.req.param();

      await ctx.var.data.memberships.deleteAsync(organization, [user]);

      return ctx.newResponse(null, 204);
    } catch (e) {
      ctx.var.logger.trackException('An error occured trying to add a remove to an organization', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async addToRolesAsync(ctx: Context): Promise<Response> {
    try {
      const { organization, user } = ctx.req.param();
      const roles: string[] = await ctx.req.json();

      await ctx.var.data.memberships.addToRolesAsync(organization, user, roles);

      return ctx.newResponse(null, 204);
    } catch (e) {
      ctx.var.logger.trackException('An error occured trying to add roles to a member', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async deleteFromRolesAsync(ctx: Context): Promise<Response> {
    try {
      const { organization, user } = ctx.req.param();
      const roles: string[] = await ctx.req.json();

      await ctx.var.data.memberships.deleteFromRolesAsync(organization, user, roles);

      return ctx.newResponse(null, 204);
    } catch (e) {
      ctx.var.logger.trackException('An error occured trying to delete roles to a member', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }
}
