import { getAssetFromKV, Options } from '@cloudflare/kv-asset-handler';
import { Config } from '../../../config';
import { EdgeDataService } from '../edge-data.service';
import { EdgeService } from '../edge.service';
import { CloudflareEdgeDataService } from './cloudflare-edge-data.service';

const cache = caches.default;

export class CloudflareEdgeService implements EdgeService {
  private readonly _data: EdgeDataService;
  private readonly _authData: EdgeDataService;
  private _request: Request;

  constructor(config: Config, private readonly event: FetchEvent) {
    this._authData = new CloudflareEdgeDataService(config, event, KVAUTH);
    this._data = new CloudflareEdgeDataService(config, event, KVDATA);
    this._request = event.request;
  }

  get authData(): EdgeDataService {
    return this._authData;
  }

  get data(): EdgeDataService {
    return this._data;
  }

  private get match(): Request {
    return new Request(this._request.url, {
      method: this._request.method,
    });
  }

  set request(x: Request) {
    this._request = this.request;
  }

  waitUntil(func: Promise<void>): void {
    this.event.waitUntil(func);
  }

  getAssetFromKV(options?: Partial<Options>): Promise<Response> {
    return getAssetFromKV(this.event, options);
  }

  getEdgeProperties(): { [key: string]: any } {
    return this._request.cf;
  }

  async cacheMatch(): Promise<Response | null> {
    const response = await cache.match(this.match);

    return response ? this.matchCheck(response) : null;
  }

  cachePut(response: Response): void {
    this.event.waitUntil(cache.put(this._request, response.clone()));
  }

  private matchCheck(match: Response): Response {
    const status = match.headers.get('cf-cache-status');
    const hdrs = new Headers({
      'content-type': 'application/json;charset=utf-8',
    });
    if (status) hdrs.set('cf-cache-status', status);

    return new Response(match.body, {
      status: 200,
      headers: hdrs,
    });
  }
}
