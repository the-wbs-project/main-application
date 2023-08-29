import { Context } from '../../config';

export class OrganizationHttpService {
  static async getMembersAsync(ctx: Context): Promise<Response> {
    try {
      const members = await ctx.get('data').organizations.getMembersAsync(ctx.req.param('organization'));

      return ctx.json(members);
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to get members', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async removeMemberAsync(ctx: Context, next: any): Promise<void> {
    try {
      await ctx.get('data').organizations.removeMemberAsync(ctx.req.param('organization'), ctx.req.param('user'));

      ctx.status(204);
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying remove a member', <Error>e);
      ctx.status(500);
    }
    await next();
  }

  static async addMemberRolesAsync(ctx: Context, next: any): Promise<void> {
    try {
      const body = await ctx.req.json();
      await ctx.get('data').organizations.addMemberRolesAsync(ctx.req.param('organization'), ctx.req.param('user'), body);

      ctx.status(204);
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying add a role for a member', <Error>e);
      ctx.status(500);
    }
    await next();
  }

  static async removeMemberRolesAsync(ctx: Context, next: any): Promise<void> {
    try {
      const body = await ctx.req.json();
      await ctx.get('data').organizations.removeMemberRolesAsync(ctx.req.param('organization'), ctx.req.param('user'), body);

      ctx.status(204);
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying add a role for a member', <Error>e);
      ctx.status(500);
    }
    await next();
  }
}
