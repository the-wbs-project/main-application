import { MailGunService } from '..';
import { Context } from '../../config';
import { Invite } from '../../models';

export class InviteHttpService {
  static async getAllAsync(ctx: Context): Promise<Response> {
    try {
      return ctx.json(await ctx.get('data').invites.getAllAsync());
    } catch (e) {
      ctx
        .get('logger')
        .trackException('An error occured trying to get all invites for an organization.', 'InviteHttpService.getAllAsync', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async getEmailAsync(ctx: Context): Promise<Response> {
    try {
      const { organization, code } = ctx.req.param();

      if (!organization || !code) return ctx.text('Missing Parameters', 500);

      /*ctx.set('organization', {
        organization,
        roles: [],
      });*/
      //
      //  Get the data from the KV
      //
      const invite = await ctx.get('data').invites.getAsync(code);

      return invite ? ctx.json(invite) : ctx.text('', 404);
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to get the invite.', 'InviteHttpService.getAsync', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async getAndAcceptAsync(ctx: Context): Promise<Response> {
    try {
      const { organization, code } = ctx.req.param();

      if (!organization || !code) return ctx.text('Missing Parameters', 500);

      /*ctx.set('organization', {
        organization,
        roles: [],
      });*/
      //
      //  Get the data from the KV
      //
      const invite = await ctx.get('data').invites.getAsync(code);

      if (!invite) return ctx.text('', 404);

      invite.dateAccepted = new Date();

      await ctx.get('data').invites.putAsync(invite);

      return ctx.json(invite);
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to get the invite.', 'InviteHttpService.getAsync', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async putAsync(ctx: Context): Promise<Response> {
    try {
      const { send } = ctx.req.param();
      const invite: Invite = await ctx.req.json();

      await ctx.get('data').invites.putAsync(invite);

      if (send ?? false) {
        const resp = await MailGunService.inviteAsync(ctx, invite);

        console.log(await resp.json());

        invite.dateSent = new Date();

        await ctx.get('data').invites.putAsync(invite);
      }
      return ctx.json(invite);
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to update an invite.', 'InviteHttpService.putAsync', <Error>e);
      return ctx.text('Internal Server Error', 500);
    }
  }
}
