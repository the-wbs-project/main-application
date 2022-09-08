import { getAssetFromKV, Options } from "@cloudflare/kv-asset-handler";
import { Config } from "../../../config";
import { EdgeDataService } from "../edge-data.service";
import { EdgeService } from "../edge.service";
import { CloudflareDataService } from "./cloudflare-data.service";

const cache = caches.default;

export class CloudflareService implements EdgeService {
  readonly authData: EdgeDataService;
  readonly data: EdgeDataService;

  constructor(private readonly config: Config, private readonly request: Request, private readonly context: ExecutionContext) {
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

  getAssetFromKV(options?: Partial<Options>): Promise<Response> {
    return getAssetFromKV(
      {
        request: this.request,
        waitUntil: this.context.waitUntil,
      },
      {
        ...options,
        ASSET_NAMESPACE: this.config.kvSite,
        ASSET_MANIFEST: {},
      },
    );
  }

  getEdgeProperties(): Record<string, any> | undefined {
    return this.request.cf;
  }

  async cacheMatch(): Promise<Response | null> {
    const response = await cache.match(this.match);

    return response ? this.matchCheck(response) : null;
  }

  cachePut(response: Response): void {
    this.context.waitUntil(cache.put(this.request, response.clone()));
  }

  private matchCheck(match: Response): Response {
    const status = match.headers.get("cf-cache-status");
    const hdrs = new Headers({
      "content-type": "application/json;charset=utf-8",
    });
    if (status) hdrs.set("cf-cache-status", status);

    return new Response(match.body, {
      status: 200,
      headers: hdrs,
    });
  }
}
