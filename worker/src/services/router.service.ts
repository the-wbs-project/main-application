import { Router, Method } from 'tiny-request-router';
import { ResponseService } from './response.service';
import { MailGunService } from './mail-gun.service';
import { SiteHttpService } from './site.http-service';
import { WorkerCall } from './worker-call.service';

export class RouterService {
  private readonly router = new Router();
  private readonly responses = new ResponseService();

  constructor(
    private readonly email: MailGunService,
    private readonly site: SiteHttpService,
  ) {}

  setup(): void {
    this.router.options('*', () => this.responses.optionsAsync());
    this.router.get('*', (call: WorkerCall) =>
      this.site.getSiteResourceAsync(call),
    );
    this.router.post('/api/send', (call: WorkerCall) =>
      this.email.handleRequestAsync(call.request),
    );
  }

  async matchAsync(call: WorkerCall): Promise<Response> {
    const request = call.request;
    const path = new URL(request.url).pathname.toLowerCase();
    const match = this.router.match(request.method as Method, path);
    if (!match)
      return new Response('Not Found', {
        status: 404,
      });

    call.params = match.params;
    //
    //  decode parameters
    //
    for (const name of Object.getOwnPropertyNames(call.params)) {
      call.params[name] = decodeURIComponent(call.params[name]);
    }
    return await match.handler(call);
  }
}
