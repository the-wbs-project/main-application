import { Env } from '../../config';
import { UserProfile } from '../../models';
import { OriginService } from '../origin-services';
import { BaseDataService } from './base.data-service';

export class UsersDataService extends BaseDataService {
  constructor(env: Env, executionCtx: ExecutionContext, origin: OriginService) {
    super(env, executionCtx, origin);
  }

  async getUserAsync(userId: string, forceRefresh = false): Promise<UserProfile> {
    const key = this.getKey(userId);

    if (!forceRefresh) {
      const kvData = await this.getKv<UserProfile>(key);

      console.log(kvData == null);

      if (kvData) return kvData;
    }
    const [apiData] = await this.getFromOriginAsync([userId]);

    if (apiData) this.putKv(key, apiData);

    return apiData;
  }

  async getUsersAsync(userIds: string[], forceRefresh = false): Promise<UserProfile[]> {
    if (userIds.length === 0) return [];

    const users: UserProfile[] = [];
    const toGet: string[] = [];

    if (forceRefresh) {
      toGet.push(...userIds);
    } else {
      for (const id of userIds) {
        const kvData = await this.getKv<UserProfile>(this.getKey(id));

        if (kvData) users.push(kvData);
        else toGet.push(id);
      }
    }
    if (toGet.length > 0) {
      const apiData = await this.getFromOriginAsync(toGet);

      for (const user of apiData) {
        if (!user) continue;

        users.push(user);
        this.putKv(this.getKey(user.userId), user);
      }
    }
    return users;
  }

  async putAsync(user: UserProfile): Promise<void> {
    const resp = await this.origin.putAsync(user, 'users/' + user.userId);

    if (resp.status >= 300) {
      throw new Error('An error occured updating the user profile.');
    }
    this.putKv(this.getKey(user.userId), user);
  }

  private async getFromOriginAsync(userIds: string[]): Promise<UserProfile[]> {
    return (await this.origin.getAsync<UserProfile[]>('users/byIds/' + encodeURIComponent(userIds.join(',')))) ?? [];
  }

  private getKey(id: string): string {
    return 'USERS|' + id;
  }
}
