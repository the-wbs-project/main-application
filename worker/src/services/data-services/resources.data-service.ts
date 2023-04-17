import { Context } from '../../config';
import { ResourceObj, Resources } from '../../models';
import { CosmosDbService } from './cosmos-db.service';

export class ResourcesDataService {
  private readonly prefix = 'RESOURCES';
  private readonly byPass = (this.ctx.env.KV_BYPASS ?? '').split(',').indexOf('RESOURCES') > -1;
  private _db?: CosmosDbService;

  constructor(private ctx: Context) {}

  async getAsync(culture: string, category: string): Promise<Resources | undefined> {
    if (this.byPass) return (await this.db.getDocumentAsync<ResourceObj>(culture, category, true))?.values;

    const kvName = [this.prefix, culture, category].join('|');
    const kvData = await this.ctx.env.KV_DATA.get<Resources>(kvName, 'json');

    if (kvData) return kvData;

    const data = (await this.db.getDocumentAsync<ResourceObj>(culture, category, true))?.values;

    if (data) this.ctx.executionCtx.waitUntil(this.ctx.env.KV_DATA.put(kvName, JSON.stringify(data)));

    return data;
  }

  private get db(): CosmosDbService {
    if (!this._db) {
      this._db = new CosmosDbService(this.ctx, '_common', 'Resources', 'language');
    }
    return this._db;
  }
}
