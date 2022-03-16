import { CosmosClient } from '@cfworker/cosmos';
import { getAssetFromKV } from '@cloudflare/kv-asset-handler';
import { Options } from '@cloudflare/kv-asset-handler/dist/types';
import { Obj } from 'itty-router';
import { DbConfig } from '../config';
//import { TokenInfo, User } from '../models';
import { Fetcher } from './fetcher.service';
import { Logger } from './logger.service';

const cache = caches.default;

export class WorkerCall extends Fetcher {
  private readonly _db: CosmosClient;
  //private _user: User | undefined;
  private _sessionId: string | undefined;
  isAuthenticated: boolean | undefined;
  params: Obj | undefined;
  request: Request;
  //token: TokenInfo | undefined;

  constructor(
    config: DbConfig,
    logger: Logger,
    private readonly event: FetchEvent,
  ) {
    super(logger);
    this.request = event.request;
    this._db = new CosmosClient({
      endpoint: config.endpoint,
      masterKey: config.key,
      dbId: config.dbId,
      collId: config.collId,
      fetch: (input: RequestInfo, init?: RequestInit) => {
        return this.fetch(input, init);
      },
    });
  }

  get db(): CosmosClient {
    return this._db;
  }

  get sessionId(): string | undefined {
    return this._sessionId;
  }

  //get user(): User | undefined {
  //return this._user;
  //}

  private get match(): Request {
    return new Request(this.request.url, {
      method: this.request.method,
    });
  }

  //setUser(user: User, sessionId: string): void {
  //this._user = user;
  //this._sessionId = sessionId;
  //}

  waitUntil(func: Promise<void>): void {
    this.event.waitUntil(func);
  }

  getAssetFromKV(options?: Partial<Options>): Promise<Response> {
    return getAssetFromKV(this.event, options);
  }

  logException(message: string, location: string, err: Error): void {
    console.log(message);
    console.log(location);
    console.log(err);
    this.logger.trackException(message, location, err);
  }

  async cacheMatch(): Promise<Response | null> {
    const response = await cache.match(this.match);

    return response ? this.matchCheck(response) : null;
  }

  cachePut(response: Response): void {
    this.event.waitUntil(cache.put(this.request, response.clone()));
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
