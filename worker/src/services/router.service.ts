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
    this.router.get(
      '/api/resources/:category',
      this.authenticate,
      Http.resources.getAsync,
    );
    this.router.get(
      '/api/projects/:ownerId/:projectId/lite',
      this.authenticate,
      Http.project.getLiteByIdAsync,
    );
    this.router.get(
      '/api/projects/:ownerId/:projectId/full',
      this.authenticate,
      Http.project.getByIdAsync,
    );
    this.router.get(
      `/api/projects/:ownerId/:projectId/wbs/:view`,
      this.authenticate,
      Http.wbs.getListAsync,
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
      },
      '1234',
    );
  }
}
