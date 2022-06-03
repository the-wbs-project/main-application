import { WorkerRequest } from '../worker-request.service';
import { BaseHttpService } from './base.http-service';

export class AuthorizationHttpService extends BaseHttpService {
  static async setupAsync(req: WorkerRequest): Promise<Response | number> {
    try {
      if (!req.params?.inviteCode) return 500;

      return await req.services.auth.setupAsync(req, req.params.inviteCode);
    } catch (e) {
      req.logException(
        'An error occured trying to create an account.',
        'AuthorizationHttpService.setupAsync',
        <Error>e,
      );
      return 500;
    }
  }

  static async callbackAsync(req: WorkerRequest): Promise<Response | number> {
    try {
      const headers = await req.services.auth.handleCallbackAsync(req);

      if (!headers) return new Response('Unauthorized', { status: 401 });

      return new Response('', {
        status: 302,
        headers,
      });
    } catch (e) {
      req.logException(
        'An error occured trying to handle the login callback.',
        'CallbackHttpService.loginCallbackAsync',
        <Error>e,
      );
      return 500;
    }
  }

  static async logoutAsync(req: WorkerRequest): Promise<Response | number> {
    try {
      return await req.services.auth.getLogoutRedirectAsync(req);
    } catch (e) {
      req.logException(
        'An error occured trying to start the logout process.',
        'CallbackHttpService.logoutAsync',
        <Error>e,
      );
      return 500;
    }
  }

  static async loggedoutAsync(req: WorkerRequest): Promise<Response | number> {
    try {
      return (
        req.services.auth.finishLogout(req) ||
        Response.redirect(new URL(req.url).origin)
      );
    } catch (e) {
      req.logException(
        'An error occured trying to finish the logout process.',
        'CallbackHttpService.loggedoutAsync',
        <Error>e,
      );
      return 500;
    }
  }

  static async currentUserAsync(
    req: WorkerRequest,
  ): Promise<Response | number> {
    try {
      if (!req.state?.userId) return 500;

      const user = await req.services.identity.getUserAsync(
        req,
        req.state.userId,
      );

      return await super.buildJson(user);
    } catch (e) {
      req.logException(
        'An error occured trying to handle the login callback.',
        'CallbackHttpService.loginCallbackAsync',
        <Error>e,
      );
      return 500;
    }
  }
}
