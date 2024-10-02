import { Context } from '../../config';

export class InvitesHttpService {
  static async getAllAsync(ctx: Context): Promise<Response> {
    try {
      const { organization } = ctx.req.param();

      return ctx.json(await ctx.var.data.invites.getAllAsync(organization));
    } catch (e) {
      ctx.var.logger.trackException('An error occured trying to get all the invites of the organization.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async sendAsync(ctx: Context): Promise<Response> {
    try {
      const { organization } = ctx.req.param();
      const body = await ctx.req.json();

      await ctx.var.data.invites.sendAsync(organization, body);

      return ctx.newResponse(null, 202);
    } catch (e) {
      ctx.var.logger.trackException('An error occured trying to send a invite.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async deleteAsync(ctx: Context): Promise<Response> {
    try {
      const { organization, inviteId } = ctx.req.param();

      await ctx.var.data.invites.deleteAsync(organization, inviteId);

      return ctx.newResponse(null, 202);
    } catch (e) {
      ctx.var.logger.trackException('An error occured trying to cancel a invite.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }
}
