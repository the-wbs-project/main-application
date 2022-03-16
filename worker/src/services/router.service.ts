import { Request, Router } from 'itty-router';
import { Config } from '../config';
import { Logger } from './logger.service';
import { MailGunService } from './mail-gun.service';
import { SiteHttpService } from './site.http-service';
import { WorkerCall } from './worker-call.service';

export class RouterService {
  private readonly router = Router();

  constructor(
    private readonly config: Config,
    private readonly email: MailGunService,
    private readonly site: SiteHttpService,
  ) {
    this.router.options('*', () => new Response(''));
    this.router.get('*', (request: Request, call: WorkerCall) =>
      this.site.getSiteResourceAsync(request, call),
    );
    this.router.post('/api/send', (request: Request) =>
      this.email.handleRequestAsync(request),
    );
  }

  async matchAsync(event: FetchEvent): Promise<Response> {
    const errorHandler = (error: { message: string; status: number }) =>
      new Response(error.message || 'Server Error', {
        status: error.status || 500,
      });

    const call = new WorkerCall(
      this.config.db,
      new Logger(this.config.appInsightsKey, event.request),
      event,
    );

    const result: Response | number = await this.router
      .handle(event.request, call)
      .catch(errorHandler);

    if (typeof result === 'number') {
      return new Response(null, {
        status: result,
      });
    }
    return result;
  }
}
