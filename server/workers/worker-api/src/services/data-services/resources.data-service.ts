import { Context } from '../../config';
import { Resources } from '../../models';
import { OriginService } from '../origin.service';

export class ResourcesDataService {
  constructor(private readonly ctx: Context) {}

  private get origin(): OriginService {
    return this.ctx.get('origin');
  }

  async getAsync(locale: string): Promise<Record<string, Record<string, string>> | undefined> {
    const key = 'RESOURCES|' + locale;

    const data = await this.ctx.env.KV_DATA.get(key);
    if (data) return JSON.parse(data);

    const result = await this.origin.getAsync<Record<string, Record<string, string>>>(`resources/all/${locale}`);

    if (result) {
      await this.ctx.env.KV_DATA.put(key, JSON.stringify(result));
    }

    return result;
  }

  async putAsync(resources: Resources): Promise<void> {
    await Promise.all([this.origin.putAsync(resources, `resources`), this.clearKvCacheAsync()]);
  }

  private async clearKvCacheAsync(): Promise<void> {
    const prefix = 'RESOURCES|';
    const keys = await this.ctx.env.KV_DATA.list({ prefix });
    for (const key of keys.keys) {
      await this.ctx.env.KV_DATA.delete(key.name);
    }
  }
}
