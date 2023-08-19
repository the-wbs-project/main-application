import { Context } from '../../config';
import { ListItem } from '../../models';
import { CosmosDbService } from './cosmos-db.service';

export class ListDataService {
  private readonly prefix = 'LISTS';
  private readonly byPass: boolean;
  private readonly db: CosmosDbService;

  constructor(private readonly ctx: Context) {
    this.byPass = (ctx.env.KV_BYPASS ?? '').split(',').indexOf(this.prefix) > -1;
    this.db = new CosmosDbService(this.ctx, 'Lists', 'type');
  }

  async getAsync(type: string): Promise<ListItem[] | undefined> {
    if (this.byPass) return await this.db.getAllByPartitionAsync<ListItem>(type, true);

    const kvName = this.key(type);
    const kvData = await this.ctx.env.KV_DATA.get<ListItem[]>(kvName, 'json');

    if (kvData) return kvData;

    const data = await this.db.getAllByPartitionAsync<ListItem>(type, true);

    if (data && data.length > 0) this.ctx.executionCtx.waitUntil(this.ctx.env.KV_DATA.put(kvName, JSON.stringify(data)));

    return data;
  }

  async putAsync(item: ListItem): Promise<void> {
    await this.db.upsertDocument(item, item.type);

    this.ctx.executionCtx.waitUntil(this.ctx.env.KV_DATA.delete(this.key(item.type)));
  }

  async deleteAsync(type: string, itemId: string): Promise<void> {
    await this.db.deleteDocument(itemId, type);

    this.ctx.executionCtx.waitUntil(this.ctx.env.KV_DATA.delete(this.key(type)));
  }

  private key(type: string): string {
    return [this.prefix, type].join('|');
  }
}
