import { Config } from '../../../config';
import { EdgeDataService } from '../edge-data.service';
import { EdgeService } from '../edge.service';
import { CloudflareDataService } from './cloudflare-data.service';

const cache = caches.default;

export class CloudflareService implements EdgeService {
  readonly authData: EdgeDataService;
  readonly data: EdgeDataService;

  constructor(config: Config, private readonly request: Request, private readonly context: ExecutionContext) {
    this.authData = new CloudflareDataService(config, context, config.kvAuth);
    this.data = new CloudflareDataService(config, context, config.kvData);
  }

  private get match(): Request {
    return new Request(this.request.url, {
      method: this.request.method,
    });
  }

  waitUntil(func: Promise<void>): void {
    this.context.waitUntil(func);
  }

  getEdgeProperties(): Record<string, any> | undefined {
    return this.request.cf;
  }

  cacheMatch(): Promise<Response | undefined> {
    return cache.match(this.match);
  }

  cachePut(response: Response): void {
    this.context.waitUntil(cache.put(this.request, response.clone()));
  }
}
