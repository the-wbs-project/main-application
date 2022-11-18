import { WorkerRequest } from '../worker-request.service';
import { BaseHttpService } from './base.http-service';

export class AuthorizationHttpService extends BaseHttpService {
  static async setupAsync(req: WorkerRequest): Promise<Response | number> {
    try {
      if (!req.params?.inviteCode) return 500;

      const invite = await req.services.data.invites.getAsync(req.params.inviteCode);
      if (!invite) {
        return Response.redirect(new URL(req.url).origin + '/info/invite-not-found');
      }
      if (invite.cancelled) {
        return Response.redirect(new URL(req.url).origin + '/info/invite-cancelled');
      }

      return await req.services.auth.setupAsync(req, req.params.inviteCode);
    } catch (e) {
      req.logException('An error occured trying to create an account.', 'AuthorizationHttpService.setupAsync', <Error>e);
      return 500;
    }
  }

  static async currentUserAsync(req: WorkerRequest): Promise<Response | number> {
    try {
      if (!req.state?.userId) return 500;

      const user = await req.services.identity.getUserAsync(req, req.state.userId);

      user!.appInfo.organizationRoles = req.state.organizations;

      return await super.buildJson(user);
    } catch (e) {
      req.logException('An error occured trying to handle the login callback.', 'CallbackHttpService.loginCallbackAsync', <Error>e);
      return 500;
    }
  }
}
