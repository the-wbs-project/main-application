import { Router } from 'itty-router';
import { Http } from './http-services';
import { MailGunService } from './mail-gun.service';
import { WorkerRequest } from './worker-request.service';
import { Auth0Service } from './auth-services';

export const AZURE_ROUTES_POST: string[] = ['api/projects/export/*', 'api/projects/import/*'];

const verify = Auth0Service.verify;

function isAdmin(req: WorkerRequest): number | void {
  if ((req.context.organization?.roles?.indexOf('admin') ?? -1) === -1) return 401;
}

export class RouterService {
  private readonly router = Router<WorkerRequest>();

  constructor(private readonly email: MailGunService) {
    this.router.options('*', () => new Response(''));
    //
    //  Non auth
    //
    this.router.get('/api/invites/preReg/:organization/:code', Http.invites.getEmailAsync);
    this.router.get('/api/invites/postReg/:organization/:code', Http.invites.getAndAcceptAsync);
    this.router.post('/api/send', this.email.handleHomepageInquiryAsync);
    this.router.get('/api/resources/Info', Http.metadata.setInfo, Http.metadata.getResourcesAsync);
    this.router.get('/api/edge-data/clear', async (req: WorkerRequest) => {
      await req.context.services.edge.data.clear();
      return 204;
    });
    this.router.get('/api/resources/:category', Http.metadata.getResourcesAsync);
    this.router.get('/api/lists/:name', Http.metadata.getListAsync);
    //
    //  Auth calls
    //
    this.router.get('/api/activity/:organization/:topLevelId', verify, Http.activity.getByIdAsync);
    this.router.get('/api/activity/:organization/user/:userId', verify, Http.activity.getByUserIdAsync);
    this.router.put('/api/activity/:organization/:dataType', verify, Http.activity.putAsync);
    this.router.get('/api/projects/:organization/my', verify, Http.project.getAllAsync);
    this.router.get('/api/projects/:organization/watched', verify, Http.project.getAllWatchedAsync);
    this.router.get('/api/projects/:organization/byId/:projectId', verify, Http.project.getByIdAsync);
    this.router.put('/api/projects/:organization/byId/:projectId', verify, Http.project.putAsync);
    this.router.get('/api/projects/:organization/byId/:projectId/nodes', verify, Http.projectNodes.getAsync);
    this.router.put('/api/projects/:organization/byId/:projectId/nodes/batch', verify, Http.projectNodes.batchAsync);
    this.router.put('/api/projects/:organization/byId/:projectId/nodes/:nodeId', verify, Http.projectNodes.putAsync);
    this.router.get('/api/projects/:organization/byId/:projectId/users', verify, Http.projectNodes.getAsync);
    this.router.get('/api/projects/:organization/snapshot/:projectId/:activityId', verify, Http.projectSnapshots.getByActivityIdAsync);
    this.router.get('/api/discussions/:organization/:associationId', verify, Http.discussions.getAsync);
    this.router.get('/api/discussions/:organization/:associationId/users', verify, Http.discussions.getUsersAsync);
    this.router.get('/api/discussions/:organization/:associationId/:threadId', verify, Http.discussions.getAsync);
    this.router.get('/api/discussions/:organization/:associationId/:threadId/text', verify, Http.discussions.getTextAsync);
    this.router.put('/api/discussions/:organization/:threadId', verify, Http.discussions.putAsync);
    this.router.get('/api/users/:organization', verify, Http.users.getAllAsync);
    this.router.get('/api/users/:organization/lite', verify, Http.users.getAllLiteAsync);
    this.router.post('/api/user', verify, isAdmin, Http.users.updateUserAsync);
    this.router.get('/api/invites', verify, Http.invites.getAllAsync);
    this.router.put('/api/invites/:send', verify, Http.invites.putAsync);
    this.router.get('/api/files/:file', verify, (req) => req.context.services.storage.statics.getAsResponse(req.params!.file));

    for (const path of AZURE_ROUTES_POST) {
      this.router.post('/' + path, verify, Http.azure.handleAsync);
    }
    this.router.get('*', () => 404);
  }

  async matchAsync(req: WorkerRequest): Promise<Response> {
    const responseOrCode = await this.router.handle(req);

    if (responseOrCode == undefined) return new Response('Not Found', { status: 404 });

    const response: Response = typeof responseOrCode === 'number' ? new Response('', { status: responseOrCode }) : responseOrCode;

    response.headers.set('Access-Control-Allow-Origin', req.context.config.corsOrigins);
    response.headers.set('Access-Control-Allow-Headers', 'Authorization');
    response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');

    return response;
  }
}
