import { getAssetFromKV } from '@cloudflare/kv-asset-handler';
import { Options } from '@cloudflare/kv-asset-handler/dist/types';
import { Params } from 'tiny-request-router';
import { ResponseService } from './response.service';

const cache = caches.default;

export class WorkerCall {
  isAuthenticated: boolean | undefined;
  params: Params | undefined;
  request: Request;

  constructor(
    private readonly event: FetchEvent,
    private readonly responseBuilder: ResponseService,
  ) {
    this.request = event.request;
  }

  private get match(): Request {
    return new Request(this.request.url, {
      method: this.request.method,
    });
  }

  waitUntil(func: Promise<void>): void {
    this.event.waitUntil(func);
  }

  getAssetFromKV(options?: Partial<Options>): Promise<Response> {
    return getAssetFromKV(this.event, options);
  }

  logException(message: string, location: string, err: unknown): void {
    console.log(message);
    console.log(location);
    console.log(err);
  }

  async cacheMatch(): Promise<Response | null> {
    const response = await cache.match(this.match);

    return response ? this.responseBuilder.match(this.request, response) : null;
  }

  cachePut(response: Response): void {
    this.event.waitUntil(cache.put(this.request, response.clone()));
  }
}
