import { WorkerRequest } from '../worker-request.service';
import { BaseHttpService } from './base.http-service';

export class AuthorizationHttpService extends BaseHttpService {
  static async setupAsync(req: WorkerRequest): Promise<Response | number> {
    try {
      if (!req.params?.inviteCode) return 500;

      return await req.auth.setupAsync(req, req.params.inviteCode);
    } catch (e) {
      req.logException(
        'An error occured trying to create an account.',
        'AuthorizationHttpService.setupAsync',
        <Error>e,
      );
      return 500;
    }
  }

  static async setupCallbackAsync(
    req: WorkerRequest,
  ): Promise<Response | number> {
    try {
      if (!req.params?.inviteCode) return 500;

      const headers = await req.auth.handleCallbackAsync(req);

      if (!headers) return new Response('Unauthorized', { status: 401 });

      await req.auth.fixPostSetupAsync(req);

      return new Response('', {
        status: 302,
        headers,
      });
    } catch (e) {
      req.logException(
        'An error occured trying to handle the callback of a setup.',
        'AuthorizationHttpService.setupCallbackAsync',
        <Error>e,
      );
      return 500;
    }
  }

  static async callbackAsync(req: WorkerRequest): Promise<Response | number> {
    try {
      const headers = await req.auth.handleCallbackAsync(req);

      if (!headers) return new Response('Unauthorized', { status: 401 });

      if (req.query?.type === 'setup') {
        await req.auth.fixPostSetupAsync(req);
      }
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

  static async currentUserAsync(
    req: WorkerRequest,
  ): Promise<Response | number> {
    try {
      if (!req.state?.userId) return 500;

      const user = await req.data.identity.getUserAsync(req, req.state.userId);

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
