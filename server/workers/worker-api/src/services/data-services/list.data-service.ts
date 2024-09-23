import { ContextLocal } from '../../config';
import { ListItem } from '../../models';
import { OriginService } from '../origin.service';

export class ListDataService {
  private readonly prefix = 'LISTS';
  private readonly byPass: boolean;

  constructor(private readonly ctx: ContextLocal) {
    this.byPass = (ctx.env.KV_BYPASS ?? '').split(',').indexOf(this.prefix) > -1;
  }

  private get origin(): OriginService {
    return this.ctx.var.origin;
  }

  async getAsync(type: string): Promise<ListItem[] | undefined> {
    const key = this.key(type);
    if (!this.byPass) {
      const kvData = await this.ctx.env.KV_DATA.get<ListItem[]>(key, 'json');

      if (kvData) return kvData;
    }

    const data = await this.origin.getAsync<ListItem[]>(`lists/${type}`);

    if (data && data.length > 0 && !this.byPass) this.ctx.executionCtx.waitUntil(this.ctx.env.KV_DATA.put(key, JSON.stringify(data)));

    return data;
  }

  async putAsync(item: ListItem): Promise<void> {
    const resp = await this.origin.putAsync(item, `lists`);

    this.ctx.executionCtx.waitUntil(this.ctx.env.KV_DATA.delete(this.key(item.type)));
  }

  async deleteAsync(type: string, itemId: string): Promise<void> {
    const resp = await this.origin.deleteAsync(`lists/${type}/${itemId}`);

    this.ctx.executionCtx.waitUntil(this.ctx.env.KV_DATA.delete(this.key(type)));
  }

  private key(type: string): string {
    return [this.prefix, type].join('|');
  }
}
