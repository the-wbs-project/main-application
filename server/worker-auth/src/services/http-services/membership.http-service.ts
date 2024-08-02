import { Context } from '../../config';

export class MembershipHttpService {
  static async getAllAsync(ctx: Context): Promise<Response> {
    try {
      const orgId = await this.getIdAsync(ctx);

      if (!orgId) return ctx.text('No organization found.', 400);

      return ctx.json(await ctx.var.data.memberships.getAllAsync(orgId));
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to get all the members of the organization.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async addAsync(ctx: Context): Promise<Response> {
    try {
      const orgId = await this.getIdAsync(ctx);

      if (!orgId) return ctx.text('No organization found.', 400);

      const members: string[] = await ctx.req.json();

      await ctx.var.data.memberships.addAsync(orgId, members);

      return ctx.newResponse(null, 204);
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to add a member to an organization', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async deleteAsync(ctx: Context): Promise<Response> {
    try {
      const orgId = await this.getIdAsync(ctx);

      if (!orgId) return ctx.text('No organization found.', 400);

      const members: string[] = await ctx.req.json();

      await ctx.var.data.memberships.deleteAsync(orgId, members);

      return ctx.newResponse(null, 204);
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to add a remove to an organization', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async addToRolesAsync(ctx: Context): Promise<Response> {
    try {
      const { user } = ctx.req.param();
      const orgId = await this.getIdAsync(ctx);

      if (!orgId) return ctx.text('No organization found.', 400);

      const roles: string[] = await ctx.req.json();

      await ctx.var.data.memberships.addToRolesAsync(orgId, user, roles);

      return ctx.newResponse(null, 204);
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to add roles to a member', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async deleteFromRolesAsync(ctx: Context): Promise<Response> {
    try {
      const { user } = ctx.req.param();
      const orgId = await this.getIdAsync(ctx);

      if (!orgId) return ctx.text('No organization found.', 400);

      const roles: string[] = await ctx.req.json();

      await ctx.var.data.memberships.deleteFromRolesAsync(orgId, user, roles);

      return ctx.newResponse(null, 204);
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to delete roles to a member', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  private static async getIdAsync(ctx: Context): Promise<string | undefined> {
    const { organization } = ctx.req.param();

    const org = await ctx.var.data.organizations.getByNameAsync(organization);

    return org?.id;
  }
}
