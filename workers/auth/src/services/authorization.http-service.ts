import { WorkerContext } from './worker-context.service';

export class AuthorizationHttpService {
  static async callbackAsync(req: WorkerContext): Promise<Response | number> {
    try {
      const headers = await req.auth.handleCallbackAsync(req);

      if (!headers) return new Response('Unauthorized', { status: 401 });

      return new Response('', {
        status: 302,
        headers,
      });
    } catch (e) {
      return 500;
    }
  }

  static async logoutAsync(req: WorkerContext): Promise<Response | number> {
    try {
      return await req.auth.getLogoutRedirectAsync(req);
    } catch (e) {
      return 500;
    }
  }

  static async loggedoutAsync(req: WorkerContext): Promise<Response | number> {
    try {
      return req.auth.finishLogout(req) || Response.redirect(new URL(req.url).origin);
    } catch (e) {
      return 500;
    }
  }
}
