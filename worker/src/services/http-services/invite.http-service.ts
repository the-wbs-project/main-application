import { Invite } from '../../models';
import { WorkerRequest } from '../worker-request.service';
import { BaseHttpService } from './base.http-service';

export class InviteHttpService extends BaseHttpService {
  static async getAllAsync(req: WorkerRequest): Promise<Response | number> {
    try {
      return await super.buildJson(await req.context.services.data.invites.getAllAsync());
    } catch (e) {
      req.context.logException(
        'An error occured trying to get all invites for an organization.',
        'InviteHttpService.getAllAsync',
        <Error>e,
      );
      return 500;
    }
  }

  static async getEmailAsync(req: WorkerRequest): Promise<Response | number> {
    try {
      if (!req.params?.organization || !req.params?.code) return 500;

      req.context.setOrganization({
        organization: req.params.organization,
        roles: [],
      });
      //
      //  Get the data from the KV
      //
      const invite = await req.context.services.data.invites.getAsync(req.params.code);

      if (!invite)
        return new Response(null, {
          status: 404,
        });

      return await super.buildJson(invite.email);
    } catch (e) {
      req.context.logException('An error occured trying to get the invite.', 'InviteHttpService.getAsync', <Error>e);
      return new Response(null, {
        status: 500,
      });
    }
  }

  static async getAndAcceptAsync(req: WorkerRequest): Promise<Response | number> {
    try {
      if (!req.params?.organization || !req.params?.code) return 500;

      req.context.setOrganization({
        organization: req.params.organization,
        roles: [],
      });
      //
      //  Get the data from the KV
      //
      const invite = await req.context.services.data.invites.getAsync(req.params.code);

      if (!invite)
        return new Response(null, {
          status: 404,
        });

      invite.dateAccepted = new Date();

      await req.context.services.data.invites.putAsync(invite);

      return await super.buildJson(invite);
    } catch (e) {
      req.context.logException('An error occured trying to get the invite.', 'InviteHttpService.getAsync', <Error>e);
      return new Response(null, {
        status: 500,
      });
    }
  }

  static async putAsync(req: WorkerRequest): Promise<Response | number> {
    try {
      const invite: Invite = await req.request.json();

      await req.context.services.data.invites.putAsync(invite);

      if (req.params?.send ?? false) {
        await req.context.services.mailgun.inviteAsync(req, invite);

        invite.dateSent = new Date();

        await req.context.services.data.invites.putAsync(invite);
      }
      return await super.buildJson(invite);
    } catch (e) {
      req.context.logException('An error occured trying to update an invite.', 'InviteHttpService.putAsync', <Error>e);
      return 500;
    }
  }
}
