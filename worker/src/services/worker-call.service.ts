import { getAssetFromKV, Options } from '@cloudflare/kv-asset-handler';
import { ResponseService } from './response.service';

const cache = caches.default;

export class WorkerCall {
  isAuthenticated: boolean | undefined;

  constructor(
    private readonly event: FetchEvent,
    private readonly responseBuilder: ResponseService,
  ) {}

  private get match(): Request {
    return new Request(this.event.request.url, {
      method: this.event.request.method,
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

    return response
      ? this.responseBuilder.match(this.event.request, response)
      : null;
  }

  cachePut(response: Response): void {
    this.event.waitUntil(cache.put(this.event.request, response.clone()));
  }
}
