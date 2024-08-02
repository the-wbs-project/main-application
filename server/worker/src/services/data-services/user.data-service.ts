import { Context } from '../../config';
import { User } from '../../models';
import { OriginService } from '../origin.service';

export class UserDataService {
  constructor(private readonly ctx: Context) {}

  private get origin(): OriginService {
    return this.ctx.get('origin');
  }

  async getAsync(userId: string): Promise<User | undefined> {
    return await this.origin.getAsync<User>(`users/profile/${userId}`);
  }
}
