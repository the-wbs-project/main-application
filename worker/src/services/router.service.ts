import { Router } from 'itty-router';
import { Http } from './http-services';
import { BaseHttpService } from './http-services/base.http-service';
import { MailGunService } from './mail-gun.service';
import { WorkerRequest } from './worker-request.service';

export const NO_AUTH_ROUTES: string[] = ['/manifest.json', '/assets/*', '/*.js', '/*.map', '/*.css'];
export const AZURE_ROUTES_POST: string[] = [
  '/api/projects/extracts/phase/download',
  '/api/projects/extracts/phase/upload',
  '/api/projects/extracts/discipline/download',
  '/api/projects/extracts/discipline/upload',
];

function apiAuth(req: WorkerRequest): Promise<Response | number | void> {
  return req.services.auth.authorizeApiAsync(req);
}

function siteAuth(req: WorkerRequest): Promise<Response | number | void> {
  return req.services.auth.authorizeSiteAsync(req);
}

function isAdmin(req: WorkerRequest): number | void {
  if ((req.organization?.roles?.indexOf('admin') ?? -1) === -1) return 401;
}

export class RouterService {
  private readonly router = Router<WorkerRequest>();

  constructor(private readonly email: MailGunService) {
    this.router.option('/api/invites/:organization/:code', this.authOptionsAsync);
    this.router.options('*', () => new Response(''));
    //
    //  Non auth
    //
    this.router.get('/info/:message', Http.site.getSiteResourceAsync);
    this.router.get('/setup/:organization/:inviteCode', Http.auth.setupAsync);
    this.router.get('/api/invites/preReg/:organization/:code', Http.invites.getEmailAsync);
    this.router.get('/api/invites/postReg/:organization/:code', Http.invites.getAndAcceptAsync);
    this.router.post('/api/send', this.email.handleHomepageInquiryAsync);
    this.router.get('/logout', Http.auth.logoutAsync);
    this.router.get('/callback', Http.auth.callbackAsync);
    this.router.get('/loggedout', Http.auth.loggedoutAsync);
    this.router.get('/api/resources/Info', Http.metadata.setInfo, Http.metadata.getResourcesAsync);
    this.router.get('/api/edge-data/clear', async (req: WorkerRequest) => {
      await req.services.edge.data.clear();
      return 204;
    });
    for (const path of NO_AUTH_ROUTES) {
      this.router.get(path, Http.site.getSiteResourceAsync);
    }
    //
    //  Auth calls
    //
    this.router.get('/api/current', apiAuth, Http.auth.currentUserAsync);
    this.router.get('/api/resources/:category', apiAuth, Http.metadata.getResourcesAsync);
    this.router.get('/api/activity/:topLevelId', apiAuth, Http.activity.getByIdAsync);
    this.router.put('/api/activity/:dataType', apiAuth, Http.activity.putAsync);
    this.router.get('/api/lists/:name', apiAuth, Http.metadata.getListAsync);
    this.router.get('/api/projects/my', apiAuth, Http.project.getAllAsync);
    this.router.get('/api/projects/watched', apiAuth, Http.project.getAllWatchedAsync);
    this.router.get('/api/projects/byId/:projectId', apiAuth, Http.project.getByIdAsync);
    this.router.put('/api/projects/byId/:projectId', apiAuth, Http.project.putAsync);
    this.router.get('/api/projects/byId/:projectId/nodes', apiAuth, Http.projectNodes.getAsync);
    this.router.put('/api/projects/byId/:projectId/nodes/batch', apiAuth, Http.projectNodes.batchAsync);
    this.router.put('/api/projects/byId/:projectId/nodes/:nodeId', apiAuth, Http.projectNodes.putAsync);
    this.router.get('/api/users', apiAuth, Http.users.getAllAsync);
    this.router.post('/api/user', apiAuth, isAdmin, Http.users.updateUserAsync);
    this.router.get('/api/invites', apiAuth, Http.invites.getAllAsync);
    this.router.put('/api/invites/:send', apiAuth, Http.invites.putAsync);

    for (const path of AZURE_ROUTES_POST) {
      this.router.post(path, apiAuth, Http.azure.handleAsync);
    }
    this.router.get('*', siteAuth, Http.site.getSiteAsync);
  }

  async matchAsync(req: WorkerRequest): Promise<Response> {
    const responseOrCode = await this.router.handle(req);

    if (typeof responseOrCode === 'number') return new Response('', { status: responseOrCode });

    return responseOrCode;
  }

  async authOptionsAsync(req: WorkerRequest): Promise<Response | number> {
    const match = await req.services.edge.cacheMatch();

    if (match) return match;

    const hdrs = new Headers();

    BaseHttpService.getAuthHeaders(req, hdrs);

    const response = new Response('', { headers: hdrs });

    req.services.edge.cachePut(response);

    return response;
  }
}
