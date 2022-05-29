import { Router } from 'itty-router';
import { Config } from '../config';
import { Http } from './http-services';
import { BaseHttpService } from './http-services/base.http-service';
import { MailGunService } from './mail-gun.service';
import { WorkerRequest } from './worker-request.service';

export const PRE_ROUTES: string[] = [
  '/manifest.json',
  '/assets/*',
  '/*.js',
  '/*.map',
  '/*.css',
];
export const AZURE_ROUTES_POST: string[] = [
  '/api/projects/:projectId/extracts/phase/download',
  '/api/projects/:projectId/extracts/phase/upload',
  '/api/projects/:projectId/extracts/discipline/download',
  '/api/projects/:projectId/extracts/discipline/upload',
];

function auth(req: WorkerRequest): Promise<Response | number | void> {
  return req.auth.authorizeAsync(req);
}

export class RouterService {
  private readonly router = Router<WorkerRequest>();

  constructor(
    private readonly config: Config,
    private readonly email: MailGunService,
  ) {
    this.router.options('*', () => new Response(''));
    this.router.get('/logout', () =>
      Response.redirect(this.config.auth.logoutCallbackUrl),
    );
    this.router.get('/callback', Http.auth.callbackAsync);
    this.router.get('/api/edge-data/clear', async (req: WorkerRequest) => {
      await req.edge.data.clear();
      return 204;
    });
    this.router.get('/api/current', auth, Http.auth.currentUserAsync);
    this.router.get(
      '/api/resources/:category',
      auth,
      Http.metadata.getResourcesAsync,
    );
    this.router.get(
      '/api/activity/:topLevelId',
      auth,
      Http.activity.getByIdAsync,
    );
    this.router.put('/api/activity', auth, Http.activity.putAsync);
    this.router.get('/api/lists/:name', auth, Http.metadata.getListAsync);
    this.router.get('/api/projects/my', auth, Http.project.getAllAsync);
    this.router.get(
      '/api/projects/watched',
      auth,
      Http.project.getAllWatchedAsync,
    );
    this.router.get(
      '/api/projects/byId/:projectId',
      auth,
      Http.project.getByIdAsync,
    );
    this.router.put(
      '/api/projects/byId/:projectId',
      auth,
      Http.project.putAsync,
    );
    this.router.get(
      `/api/projects/byId/:projectId/nodes`,
      auth,
      Http.projectNodes.getAsync,
    );
    this.router.put(
      `/api/projects/byId/:projectId/nodes/batch`,
      auth,
      Http.projectNodes.batchAsync,
    );
    this.router.put(
      `/api/projects/byId/:projectId/nodes/:nodeId`,
      auth,
      Http.projectNodes.putAsync,
    );
    this.router.option(
      `/api/invites/:organization/:code`,
      this.authOptionsAsync,
    );
    this.router.get(`/api/invites/:organization/:code`, Http.invites.getAsync);
    this.router.get(`/setup/:inviteCode`, Http.auth.setupAsync);
    this.router.post('/api/send', (request: WorkerRequest) =>
      this.email.handleRequestAsync(request),
    );
    for (const path of AZURE_ROUTES_POST) {
      this.router.post(path, auth, Http.azure.handleAsync);
    }
    for (const path of PRE_ROUTES) {
      this.router.get(path, Http.site.getSiteResourceAsync);
    }
    this.router.get('*', auth, Http.site.getSiteAsync);
  }

  async matchAsync(req: WorkerRequest): Promise<Response> {
    const responseOrCode = await this.router.handle(req);

    if (typeof responseOrCode === 'number')
      return new Response('', { status: responseOrCode });

    return responseOrCode;
  }

  async authOptionsAsync(req: WorkerRequest): Promise<Response | number> {
    const match = await req.edge.cacheMatch();

    if (match) return match;

    const hdrs = new Headers();

    BaseHttpService.getAuthHeaders(req, hdrs);

    const response = new Response('', { headers: hdrs });

    req.edge.cachePut(response);

    return response;
  }
}
