import { Context } from '../../config';
import { Transformers } from '../transformers';

export class InviteHttpService {
  static async getAsync(ctx: Context): Promise<Response> {
    try {
      const { organizationId, all } = ctx.req.param();
      const invites = await ctx.var.data.invites.getAsync(organizationId, all === 'true');
      const userIds = [...new Set(invites.map((x) => x.invitedById))];
      const users = await ctx.var.data.users.getUsersAsync(userIds);

      for (const invite of invites) {
        const user = users.find((x) => x.userId === invite.invitedById);

        if (user) {
          invite.invitedBy = Transformers.user.toViewModel(user, 'organization');
        }
      }

      return ctx.json(invites);
    } catch (error) {
      ctx.var.logger.trackException('An error occured trying to get content resources.', <Error>error);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async postAsync(ctx: Context): Promise<Response> {
    try {
      const { organizationId } = ctx.req.param();
      const invite = await ctx.req.json();

      if (organizationId !== invite.organizationId) {
        return ctx.text('Bad Request', 400);
      }

      await ctx.var.data.invites.createInviteAsync(invite);

      return ctx.newResponse(null, 201);
    } catch (error) {
      ctx.var.logger.trackException('An error occured trying to create an invite.', <Error>error);
      return ctx.text('Internal Server Error', 500);
    }
  }

  static async putAsync(ctx: Context): Promise<Response> {
    try {
      const { organizationId, inviteId } = ctx.req.param();
      const invite = await ctx.req.json();

      if (organizationId !== invite.organizationId) {
        return ctx.text('Bad Request', 400);
      }
      if (inviteId !== invite.id) {
        return ctx.text('Bad Request', 400);
      }

      await ctx.var.data.invites.updateInviteAsync(invite);

      return ctx.newResponse(null, 204);
    } catch (error) {
      ctx.var.logger.trackException('An error occured trying to update an invite.', <Error>error);
      return ctx.text('Internal Server Error', 500);
    }
  }

  static async deleteAsync(ctx: Context): Promise<Response> {
    try {
      const { organizationId, inviteId } = ctx.req.param();

      await ctx.var.data.invites.cancelInviteAsync(organizationId, inviteId);

      return ctx.newResponse(null, 204);
    } catch (error) {
      ctx.var.logger.trackException('An error occured trying to cancel an invite.', <Error>error);
      return ctx.text('Internal Server Error', 500);
    }
  }
}
