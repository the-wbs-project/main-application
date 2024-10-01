import { Env } from '../../config';
import { Resources } from '../../models';
import { OriginService } from '../origin-services';
import { BaseDataService } from './base.data-service';

export class ResourcesDataService extends BaseDataService {
  constructor(env: Env, executionCtx: ExecutionContext, origin: OriginService) {
    super(env, executionCtx, origin);
  }

  async getAsync(locale: string): Promise<Resources | undefined> {
    const key = 'RESOURCES|' + locale;

    const data = await this.getKv<Resources>(key);
    if (data) return data;

    const result = await this.getFromOriginAsync(locale);

    if (result) {
      await this.putKv(key, result);
    }

    return result;
  }

  getFromOriginAsync(locale: string): Promise<Resources | undefined> {
    return this.origin.getAsync<Resources>(`resources/all/${locale}`);
  }

  async putAsync(resources: Resources): Promise<void> {
    await Promise.all([this.origin.putAsync(resources, `resources`), this.clearKvCacheAsync()]);
  }

  private async clearKvCacheAsync(): Promise<void> {
    const prefix = 'RESOURCES|';
    const keys = await this.kv.list({ prefix });
    for (const key of keys.keys) {
      await this.kv.delete(key.name);
    }
  }
}
