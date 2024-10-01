import { Env } from '../../config';
import { ListItem } from '../../models';
import { OriginService } from '../origin-services';
import { BaseDataService } from './base.data-service';

export class ListDataService extends BaseDataService {
  private readonly prefix = 'LISTS';
  private readonly byPass: boolean;

  constructor(env: Env, executionCtx: ExecutionContext, origin: OriginService) {
    super(env, executionCtx, origin);
    this.byPass = (env.KV_BYPASS ?? '').split(',').indexOf(this.prefix) > -1;
  }

  async getAsync(type: string): Promise<ListItem[] | undefined> {
    const key = this.key(type);
    if (!this.byPass) {
      const kvData = await this.kv.get<ListItem[]>(key, 'json');

      if (kvData) return kvData;
    }

    const data = await this.origin.getAsync<ListItem[]>(`lists/${type}`);

    if (data && data.length > 0 && !this.byPass) this.kv.put(key, JSON.stringify(data));

    return data;
  }

  async putAsync(item: ListItem): Promise<void> {
    const resp = await this.origin.putAsync(item, `lists`);

    this.clearKv(this.key(item.type));
  }

  async deleteAsync(type: string, itemId: string): Promise<void> {
    const resp = await this.origin.deleteAsync(`lists/${type}/${itemId}`);

    this.clearKv(this.key(type));
  }

  private key(type: string): string {
    return [this.prefix, type].join('|');
  }
}
