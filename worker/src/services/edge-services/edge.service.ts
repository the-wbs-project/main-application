import { Options } from "@cloudflare/kv-asset-handler";
import { EdgeDataService } from "./edge-data.service";

export interface EdgeService {
  data: EdgeDataService;
  authData: EdgeDataService;

  getEdgeProperties(): { [key: string]: string | null | any };

  waitUntil(func: Promise<void>): void;

  getAssetFromKV(options?: Partial<Options>): Promise<Response>;

  cacheMatch(): Promise<Response | null>;

  cachePut(response: Response): void;
}
