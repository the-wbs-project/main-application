import { Env } from '../../config';
import { OriginService } from '../origin-services';

export abstract class BaseDataService {
  constructor(protected readonly env: Env, protected readonly executionCtx: ExecutionContext, protected readonly origin: OriginService) {}

  protected get kv(): KVNamespace {
    return this.env.KV_DATA;
  }

  protected getKv<T>(key: string): Promise<T | null> {
    return this.env.KV_DATA.get<T>(key, 'json');
  }

  protected putKv(key: string, data: any): void {
    this.executionCtx.waitUntil(this.env.KV_DATA.put(key, typeof data === 'string' ? data : JSON.stringify(data)));
  }

  protected clearKv(key: string): void {
    this.executionCtx.waitUntil(this.env.KV_DATA.delete(key));
  }
}
