import { Request, Router } from 'itty-router';
import { Config } from '../config';
import { HttpServiceFactory } from './http-services';
import { MailGunService } from './mail-gun.service';
import { WorkerRequest } from './worker-request.service';

export class RouterService {
  private readonly router = Router<WorkerRequest>();

  constructor(
    private readonly config: Config,
    private readonly email: MailGunService,
    private readonly http: HttpServiceFactory,
  ) {
    this.router.options('*', () => new Response(''));
    this.router.get('/logout', () =>
      Response.redirect(this.config.auth.logoutCallbackUrl),
    );
    this.router.post('/api/send', (request: Request) =>
      this.email.handleRequestAsync(request),
    );
    this.router.get('*', (request: WorkerRequest) =>
      this.http.site.getSiteResourceAsync(request),
    );
  }

  async matchAsync(req: WorkerRequest): Promise<Response> {
    const responseOrCode = await this.router.handle(req);

    if (typeof responseOrCode === 'number')
      return new Response('', { status: responseOrCode });

    return responseOrCode;
  }
}
