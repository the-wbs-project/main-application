import { Router } from 'itty-router';
import { AuthorizationHttpService } from './authorization.http-service';
import { WorkerContext } from './worker-context.service';

export const NO_AUTH_ROUTES: string[] = [
  '/info/*',
  '/setup/*',
  '/callback',
  '/logout',
  '/loggedout',
  '/api/send',
  '/api/resources/Info',
  '/api/edge-data/clear',
  '/api/invites/preReg/*',
  '/api/invites/postReg/*',
];

export const ADMIN_ROUTES: string[] = ['/api/user'];

function apiAuth(req: WorkerContext): Promise<Response | number | void> {
  return req.auth.authorizeApiAsync(req.request);
}

function siteAuth(req: WorkerContext): Promise<Response | number | void> {
  return req.auth.authorizeSiteAsync(req.request);
}

function isAdmin(req: WorkerContext): Promise<Response | number | void> {
  return req.auth.authorizeApiAsync(req.request, true);
}

export class RouterService {
  private readonly router = Router<WorkerContext>();

  constructor() {
    this.router.options('*', () => 200);
    this.router.get('/logout', AuthorizationHttpService.logoutAsync);
    this.router.get('/callback', AuthorizationHttpService.callbackAsync);
    this.router.get('/loggedout', AuthorizationHttpService.loggedoutAsync);

    for (const path of NO_AUTH_ROUTES) {
      this.router.all(path, () => 200);
    }
    for (const path of ADMIN_ROUTES) {
      this.router.all(path, isAdmin);
    }

    this.router.all('/api/*', apiAuth);
    this.router.all('*', siteAuth);
  }

  async matchAsync(req: WorkerContext): Promise<Response> {
    const responseOrCode = await this.router.handle(req);

    if (typeof responseOrCode === 'number') return new Response('', { status: responseOrCode });

    return responseOrCode;
  }
}
