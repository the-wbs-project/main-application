import { Router } from 'itty-router';
import { Http } from './http-services';
import { MailGunService } from './mail-gun.service';
import { WorkerRequest } from './worker-request.service';

export const AZURE_ROUTES_POST: string[] = ['/api/projects/export/*', '/api/projects/import/*'];
export const RESOURCES = ['/manifest.json', '/assets/*', '/*.js', '/*.map', '/*.css'];

async function auth(req: WorkerRequest): Promise<Response | void> {
  return req.services.auth.run(req);
}

function isAdmin(req: WorkerRequest): number | void {
  if ((req.organization?.roles?.indexOf('admin') ?? -1) === -1) return 401;
}

export class RouterService {
  private readonly router = Router<WorkerRequest>();

  constructor(private readonly email: MailGunService) {
    this.router.option('/api/invites/:organization/:code', auth, this.authOptionsAsync);
    this.router.options('*', auth, () => new Response(''));

    this.router.get('/info/:message', auth, Http.site.getSiteResourceAsync);
    this.router.get('/setup/:organization/:inviteCode', auth, Http.auth.setupAsync);
    this.router.get('/api/edge-data/clear', auth, async (req: WorkerRequest) => {
      await req.services.edge.data.clear();
      return 204;
    });

    this.router.get('/api/current', auth, Http.auth.currentUserAsync);
    this.router.post('/api/send', this.email.handleHomepageInquiryAsync);

    this.router.get('/api/resources/Info', auth, Http.metadata.setInfo, Http.metadata.getResourcesAsync);
    this.router.get('/api/resources/:category', auth, Http.metadata.getResourcesAsync);

    this.router.get('/api/activity/:topLevelId', auth, Http.activity.getByIdAsync);
    this.router.get('/api/activity/user/:userId', auth, Http.activity.getByUserIdAsync);
    this.router.put('/api/activity/:dataType', auth, Http.activity.putAsync);

    this.router.get('/api/projects/my', auth, Http.project.getAllAsync);
    this.router.get('/api/projects/watched', auth, Http.project.getAllWatchedAsync);
    this.router.get('/api/projects/byId/:projectId', auth, Http.project.getByIdAsync);
    this.router.put('/api/projects/byId/:projectId', auth, Http.project.putAsync);
    this.router.get('/api/projects/byId/:projectId/nodes', auth, Http.projectNodes.getAsync);
    this.router.put('/api/projects/byId/:projectId/nodes/batch', auth, Http.projectNodes.batchAsync);
    this.router.put('/api/projects/byId/:projectId/nodes/:nodeId', auth, Http.projectNodes.putAsync);
    this.router.get('/api/projects/snapshot/:projectId/:activityId', auth, Http.projectSnapshots.getByActivityIdAsync);

    this.router.post('/api/user', auth, isAdmin, Http.users.updateUserAsync);
    this.router.get('/api/users', auth, Http.users.getAllAsync);
    this.router.get('/api/users/lite', auth, Http.users.getAllLiteAsync);

    this.router.get('/api/invites', auth, Http.invites.getAllAsync);
    this.router.put('/api/invites/:send', auth, Http.invites.putAsync);
    this.router.get('/api/invites/preReg/:organization/:code', auth, Http.invites.getEmailAsync);
    this.router.get('/api/invites/postReg/:organization/:code', auth, Http.invites.getAndAcceptAsync);

    this.router.get('/api/lists/:name', auth, Http.metadata.getListAsync);
    this.router.get('/api/files/:file', auth, (req) => req.services.storage.statics.getAsResponse(req.params!.file));

    for (const path of AZURE_ROUTES_POST) {
      this.router.post(path, auth, Http.azure.handleAsync);
    }
    for (const path of RESOURCES) {
      this.router.get(path, Http.site.getSiteResourceAsync);
    }
    this.router.get('*', auth, Http.site.getSiteAsync);
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

    hdrs.set('Access-Control-Allow-Origin', 'https://' + req.config.auth.domain);
    hdrs.set('Access-Control-Allow-Methods', 'GET');

    const response = new Response('', { headers: hdrs });

    req.services.edge.cachePut(response);

    return response;
  }
}
