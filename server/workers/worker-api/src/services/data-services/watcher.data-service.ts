import { Env } from '../../config';
import { OriginService } from '../origin-services';
import { BaseDataService } from './base.data-service';

export class WatcherDataService extends BaseDataService {
  constructor(env: Env, executionCtx: ExecutionContext, origin: OriginService) {
    super(env, executionCtx, origin);
  }

  async getWatchedAsync(userId: string): Promise<{ owner: string; id: string }[]> {
    return (await this.origin.getAsync<{ owner: string; id: string }[]>(`watchers/entries/${userId}`)) ?? [];
  }

  async getWatchersAsync(ownerId: string, id: string): Promise<string[]> {
    return (await this.origin.getAsync<string[]>(`watchers/users/${ownerId}/${id}`)) ?? [];
  }

  async getWatcherCountAsync(ownerId: string, id: string): Promise<number> {
    return (await this.origin.getAsync<number>(`watchers/users/${ownerId}/${id}/count`)) ?? 0;
  }
}
