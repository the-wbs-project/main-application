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
      '/api/projects/:ownerId/:projectId',
      this.authenticate,
      this.checkClaimAsync,
      Http.project.getByIdAsync,
    );
    this.router.get(
      `/api/projects/:ownerId/:projectId/nodes`,
      this.authenticate,
      this.checkClaimDeeperAsync,
      Http.projectNodes.getAsync,
    );
    this.router.put(
      `/api/projects/:ownerId/:projectId/nodes/:nodeId`,
      this.authenticate,
      this.checkClaimDeeperAsync,
      Http.projectNodes.putAsync,
    );
    this.router.post('/api/send', (request: WorkerRequest) =>
      this.email.handleRequestAsync(request),
    );
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
        },
      },
      '1234',
    );
  }

  async checkClaimAsync(req: WorkerRequest): Promise<number | void> {
    //
    //  If any of the necessary information is missing, BAIL!
    //
    if (
      !req.params?.ownerId ||
      !req.params?.projectId ||
      !req.user?.appInfo?.organizations
    )
      return 500;
    //
    //  Next check that the owner ID is in the claims
    //
    if (req.user.appInfo.organizations.indexOf(req.params.ownerId) === -1)
      return 401;
  }

  async checkClaimDeeperAsync(req: WorkerRequest): Promise<number | void> {
    //
    //  If any of the necessary information is missing, BAIL!
    //
    if (
      !req.params?.ownerId ||
      !req.params?.projectId ||
      !req.user?.appInfo?.organizations
    )
      return 500;
    //
    //  Next check that the owner ID is in the claims
    //
    if (req.user.appInfo.organizations.indexOf(req.params.ownerId) === -1)
      return 401;
    //
    //  Now just to be sure we need to make sure the project ID sent is ACTUALLY associated to the project id,
    //    or else it could be a spoof if retrieving nodes
    //
    const project = await req.data.projects.getAsync(
      req.params.ownerId,
      req.params.projectId,
    );

    if (project == null) return 401;
  }
}
