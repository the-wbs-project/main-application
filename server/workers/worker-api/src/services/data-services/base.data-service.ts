import { Context } from '../../config';
import { OriginService } from '../origin.service';

export abstract class BaseDataService {
  constructor(protected readonly ctx: Context) {}

  protected get origin(): OriginService {
    return this.ctx.var.origin;
  }

  protected get kv(): KVNamespace {
    return this.ctx.env.KV_DATA;
  }

  protected getKv<T>(key: string): Promise<T | null> {
    return this.ctx.env.KV_DATA.get<T>(key, 'json');
  }

  protected putKv(key: string, data: any): void {
    this.ctx.executionCtx.waitUntil(this.ctx.env.KV_DATA.put(key, typeof data === 'string' ? data : JSON.stringify(data)));
  }

  protected clearKv(key: string): void {
    this.ctx.executionCtx.waitUntil(this.ctx.env.KV_DATA.delete(key));
  }
}
