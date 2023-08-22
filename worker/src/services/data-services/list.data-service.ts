import { Context } from '../../config';
import { ListItem } from '../../models';
import { AzureService } from '../azure.service';

export class ListDataService {
  private readonly prefix = 'LISTS';
  private readonly byPass: boolean;

  constructor(private readonly ctx: Context) {
    this.byPass = (ctx.env.KV_BYPASS ?? '').split(',').indexOf(this.prefix) > -1;
  }

  async getAsync(type: string): Promise<ListItem[] | undefined> {
    if (!this.byPass) {
      const kvData = await this.ctx.env.KV_DATA.get<ListItem[]>(this.key(type), 'json');

      if (kvData) return kvData;
    }

    const data = await AzureService.getAsync<ListItem[]>(this.ctx, `lists/${type}`);

    if (data && data.length > 0 && !this.byPass)
      this.ctx.executionCtx.waitUntil(this.ctx.env.KV_DATA.put(this.key(type), JSON.stringify(data)));

    return data;
  }

  async putAsync(item: ListItem): Promise<void> {
    const resp = await AzureService.putAsync(this.ctx, `lists`, item);

    this.ctx.executionCtx.waitUntil(this.ctx.env.KV_DATA.delete(this.key(item.type)));
  }

  async deleteAsync(type: string, itemId: string): Promise<void> {
    const resp = await AzureService.deleteAsync(this.ctx, `lists/${type}/${itemId}`);

    this.ctx.executionCtx.waitUntil(this.ctx.env.KV_DATA.delete(this.key(type)));
  }

  private key(type: string): string {
    return [this.prefix, type].join('|');
  }
}
