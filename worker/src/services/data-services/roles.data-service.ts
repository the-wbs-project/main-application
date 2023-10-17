import { Context } from '../../config';
import { Role } from '../../models';
import { OriginService } from '../origin.service';

export class RolesDataService {
  private readonly key = 'ROLES';
  private readonly byPass: boolean;

  constructor(private readonly ctx: Context) {
    this.byPass = (ctx.env.KV_BYPASS ?? '').split(',').includes(this.key);
  }

  private get origin(): OriginService {
    return this.ctx.get('origin');
  }

  async getAsync(): Promise<Role[]> {
    if (!this.byPass) {
      const kvData = await this.ctx.env.KV_DATA.get<Role[]>(this.key, 'json');

      if (kvData) return kvData;
    }

    const data = await this.origin.getAsync<Role[]>('roles');

    if (data && data.length > 0 && !this.byPass) this.ctx.executionCtx.waitUntil(this.ctx.env.KV_DATA.put(this.key, JSON.stringify(data)));

    return data ?? [];
  }
}
