import { Context } from '../../config';
import { Organization } from '../../models';
import { OriginService } from '../origin.service';

export class OrganizationDataService {
  constructor(private readonly ctx: Context) {}

  private get origin(): OriginService {
    return this.ctx.get('origin');
  }

  async getAsync(name: string): Promise<Organization | undefined> {
    const key = ['ORGS', name].join('|');
    let data = await this.ctx.env.KV_DATA.get<Organization>(key, 'json');

    if (data) return data;

    const data2 = await this.origin.getAsync<Organization>(`organizations/${name}`);

    if (data2) this.ctx.executionCtx.waitUntil(this.ctx.env.KV_DATA.put(key, JSON.stringify(data2)));

    return data2;
  }
}
