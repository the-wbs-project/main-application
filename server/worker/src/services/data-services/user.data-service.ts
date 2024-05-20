import { Context } from '../../config';
import { User } from '../../models';
import { OriginService } from '../origin.service';

export class UserDataService {
  constructor(private readonly ctx: Context) {}

  private get origin(): OriginService {
    return this.ctx.get('origin');
  }

  async getAsync(userId: string): Promise<User | undefined> {
    const kvKey = `USERS|${userId}`;
    let data: User | undefined | null = await this.ctx.env.KV_DATA.get<User>(kvKey, 'json');

    if (data) return data;

    data = await this.origin.getAsync<User>(`users/${userId}`);

    if (data) this.ctx.executionCtx.waitUntil(this.ctx.env.KV_DATA.put(kvKey, JSON.stringify(data)));

    return data;
  }
}
