import { Context } from '../../config';
import { Invite } from '../../models';

export class InviteHttpService {
  static async getAsync(ctx: Context): Promise<Response> {
    try {
      const invites = (await ctx.var.origin.getAsync<Invite[]>()) ?? [];
      const userIds = [...new Set(invites.map((x) => x.invitedById))];
      const users = await ctx.var.data.users.getUsersAsync(userIds);

      for (const invite of invites) {
        const user = users.find((x) => x.userId === invite.invitedById);

        if (user) invite.invitedByName = user.fullName;
      }

      return ctx.json(invites);
    } catch (error) {
      ctx.var.logger.trackException('An error occured trying to get orgs invites.', <Error>error);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async postAsync(ctx: Context): Promise<Response> {
    try {
      const { organization } = ctx.req.param();
      const invite = await ctx.req.json();

      if (organization !== invite.organizationId) {
        return ctx.text('Bad Request', 400);
      }

      const resp = await ctx.var.origin.postAsync(invite);

      return ctx.newResponse(resp.body, resp.status);
    } catch (error) {
      ctx.var.logger.trackException('An error occured trying to create an invite.', <Error>error);
      return ctx.text('Internal Server Error', 500);
    }
  }

  static async putAsync(ctx: Context): Promise<Response> {
    try {
      const { organization, inviteId } = ctx.req.param();
      const invite = await ctx.req.json();

      if (organization !== invite.organizationId) {
        return ctx.text('Bad Request', 400);
      }
      if (inviteId !== invite.id) {
        return ctx.text('Bad Request', 400);
      }

      const resp = await ctx.var.origin.putAsync(invite);

      return ctx.newResponse(resp.body, resp.status);
    } catch (error) {
      ctx.var.logger.trackException('An error occured trying to update an invite.', <Error>error);
      return ctx.text('Internal Server Error', 500);
    }
  }

  static async deleteAsync(ctx: Context): Promise<Response> {
    try {
      const resp = await ctx.var.origin.deleteAsync();

      return ctx.newResponse(resp.body, resp.status);
    } catch (error) {
      ctx.var.logger.trackException('An error occured trying to cancel an invite.', <Error>error);
      return ctx.text('Internal Server Error', 500);
    }
  }
}
