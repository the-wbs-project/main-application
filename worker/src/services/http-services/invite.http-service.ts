import { Context } from '../../config';
import { Invite } from '../../models';

export class InviteHttpService {
  static async getAsync(ctx: Context): Promise<Response> {
    try {
      const { organization, includeAll } = ctx.req.param();
      const invites = await ctx.var.data.invites.getAllAsync(organization, includeAll === 'true');
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

  static async resendAsync(ctx: Context): Promise<Response> {
    try {
      const { organization, inviteId } = ctx.req.param();
      const { invite, onboardUrl }: { invite: Invite; onboardUrl: string } = await ctx.req.json();

      if (organization !== invite.organizationId || inviteId !== invite.id) {
        return ctx.text('Bad Request', 400);
      }

      const org = await ctx.var.data.organizations.getByIdAsync(invite.organizationId);

      if (org) {
        await ctx.env.SEND_MAIL_QUEUE.send({
          type: 'template',
          templateId: ctx.env.EMAIL_TEMPLATE_INVITE,
          toList: [invite.email],
          data: {
            organization: org.name,
            link: onboardUrl,
          },
        });
      }

      invite.lastInviteSentDate = new Date().toISOString();

      await ctx.var.data.invites.updateAsync(invite);

      return ctx.newResponse(null, 204);
    } catch (error) {
      ctx.var.logger.trackException('An error occured trying to create an invite.', <Error>error);
      return ctx.text('Internal Server Error', 500);
    }
  }

  static async postAsync(ctx: Context): Promise<Response> {
    try {
      const { organization } = ctx.req.param();
      const { invite, onboardUrl }: { invite: Invite; onboardUrl: string } = await ctx.req.json();

      if (organization !== invite.organizationId) {
        return ctx.text('Bad Request', 400);
      }

      await ctx.var.data.invites.createAsync(invite);

      const org = await ctx.var.data.organizations.getByIdAsync(invite.organizationId);

      if (org) {
        await ctx.env.SEND_MAIL_QUEUE.send({
          type: 'template',
          templateId: ctx.env.EMAIL_TEMPLATE_INVITE,
          toList: [invite.email],
          data: {
            organization: org.name,
            link: onboardUrl,
          },
        });
      }

      return ctx.newResponse(null, 204);
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

      await ctx.var.data.invites.updateAsync(invite);

      return ctx.newResponse(null, 204);
    } catch (error) {
      ctx.var.logger.trackException('An error occured trying to update an invite.', <Error>error);
      return ctx.text('Internal Server Error', 500);
    }
  }

  static async deleteAsync(ctx: Context): Promise<Response> {
    try {
      const { organization, inviteId } = ctx.req.param();

      await ctx.var.data.invites.cancelAsync(organization, inviteId);

      return ctx.newResponse(null, 204);
    } catch (error) {
      ctx.var.logger.trackException('An error occured trying to cancel an invite.', <Error>error);
      return ctx.text('Internal Server Error', 500);
    }
  }
}
