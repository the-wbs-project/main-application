import { Options } from '@cloudflare/kv-asset-handler';
import { EdgeDataService } from './edge-data.service';

export interface EdgeService {
  data: EdgeDataService;
  //authData: EdgeDataService;

  getEdgeProperties(): Record<string, any>;

  waitUntil(func: Promise<unknown>): void;

  getAssetFromKV(options?: Partial<Options>): Promise<Response>;

  cacheMatch(): Promise<Response | null>;

  cachePut(response: Response): void;
}
