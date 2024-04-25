import { Context } from '../../config';
import { OriginService } from '../origin.service';

export class OrganizationDataService {
  constructor(private readonly ctx: Context) {}

  private get origin(): OriginService {
    return this.ctx.get('origin');
  }

  async getNameAsync(name: string): Promise<string | undefined> {
    const key = this.key(name);
    let data: string | null | undefined = await this.ctx.env.KV_DATA.get(key, 'text');

    if (data) return data;

    data = await this.origin.getTextAsync(`organizations/${name}`);

    console.log(data);
    if (data) this.ctx.executionCtx.waitUntil(this.ctx.env.KV_DATA.put(key, data));

    return data;
  }

  private key(name: string): string {
    return ['ORG_NAMES', name].join('|');
  }
}
