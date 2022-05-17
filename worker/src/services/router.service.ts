import { Router } from 'itty-router';
import { Config } from '../config';
import { Http } from './http-services';
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
    this.router.get('/api/edge-data/clear', async (req: WorkerRequest) => {
      await req.edge.data.clear();
      return 204;
    });
    this.router.get('/api/current', this.authenticate, (req: WorkerRequest) =>
      Http.json(req.user),
    );
    this.router.get(
      '/api/resources/:category',
      this.authenticate,
      Http.metadata.getResourcesAsync,
    );
    this.router.get(
      '/api/lists/:name',
      this.authenticate,
      Http.metadata.getListAsync,
    );
    this.router.get(
      '/api/projects/my',
      this.authenticate,
      this.checkClaimAsync,
      Http.project.getAllAsync,
    );
    this.router.get(
      '/api/projects/watched',
      this.authenticate,
      this.checkClaimAsync,
      Http.project.getAllWatchedAsync,
    );
    this.router.get(
      '/api/projects/byId/:projectId',
      this.authenticate,
      this.checkClaimAsync,
      Http.project.getByIdAsync,
    );
    this.router.put(
      '/api/projects/byId/:projectId',
      this.authenticate,
      this.checkClaimAsync,
      Http.project.putAsync,
    );
    this.router.get(
      `/api/projects/byId/:projectId/nodes`,
      this.authenticate,
      this.checkClaimAsync,
      Http.projectNodes.getAsync,
    );
    this.router.put(
      `/api/projects/byId/:projectId/nodes/batch`,
      this.authenticate,
      this.checkClaimAsync,
      Http.projectNodes.batchAsync,
    );
    this.router.put(
      `/api/projects/byId/:projectId/nodes/:nodeId`,
      this.authenticate,
      this.checkClaimAsync,
      Http.projectNodes.putAsync,
    );
    this.router.post('/api/send', (request: WorkerRequest) =>
      this.email.handleRequestAsync(request),
    );
    for (const path of AZURE_ROUTES_POST) {
      this.router.post(
        path,
        this.authenticate,
        this.checkClaimAsync,
        Http.azure.handleAsync,
      );
    }
    for (const path of PRE_ROUTES) {
      this.router.get(path, Http.site.getSiteResourceAsync);
    }
    this.router.get('*', this.authenticate, Http.site.getSiteAsync);
  }

  async matchAsync(req: WorkerRequest): Promise<Response> {
    const responseOrCode = await this.router.handle(req);

    if (typeof responseOrCode === 'number')
      return new Response('', { status: responseOrCode });

    return responseOrCode;
  }

  authenticate(req: WorkerRequest): void {
    req.setUser(
      {
        userInfo: {
          culture: 'en-US',
        },
        appInfo: {
          organizations: ['acme_engineering'],
          lastOrg: 'acme_engineering',
        },
      },
      '1234',
    );
    req.data.setOrganization('acme_engineering');
  }

  async checkClaimAsync(req: WorkerRequest): Promise<number | void> {
    //
    //  If any of the necessary information is missing, BAIL!
    //
    if (
      !req.params?.projectId ||
      !req.user?.appInfo?.lastOrg ||
      !req.user?.appInfo?.organizations
    )
      return 500;
    //
    //  Next check that the owner ID is in the claims
    //
    if (req.user.appInfo.organizations.indexOf(req.user.appInfo.lastOrg) === -1)
      return 401;
  }
}
