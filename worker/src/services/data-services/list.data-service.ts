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

    const kvName = [this.prefix, type].join('|');
    const kvData = await this.ctx.env.KV_DATA.get<ListItem[]>(kvName, 'json');

    if (kvData) return kvData;

    const data = await this.db.getAllByPartitionAsync<ListItem>(type, true);

    if (data && data.length > 0) this.ctx.executionCtx.waitUntil(this.ctx.env.KV_DATA.put(kvName, JSON.stringify(data)));

    return data;
  }
}
