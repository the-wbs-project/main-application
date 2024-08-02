import { Context } from '../../config';
import { Organization } from '../../models';
import { UserViewModel } from '../../view-models';
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

  async getUsersAsync(name: string): Promise<UserViewModel[]> {
    const key = ['ORGS', name, 'USERS'].join('|');
    const kvData = await this.ctx.env.KV_DATA.get<UserViewModel[]>(key, 'json');

    if (kvData) return kvData;
    const users = await this.ctx.var.origin.getAsync<UserViewModel[]>(`organizations/${name}/users`);

    if (!users) return [];

    this.ctx.executionCtx.waitUntil(this.ctx.env.KV_DATA.put(key, JSON.stringify(users)));

    return users;
  }

  async getUserAsync(name: string, userId: string, visibility: string): Promise<UserViewModel | null> {
    const key = ['ORGS', name, 'USERS', userId, visibility].join('|');
    const kvData = await this.ctx.env.KV_DATA.get<UserViewModel>(key, 'json');

    if (kvData) return kvData;
    const users = await this.ctx.var.origin.getAsync<UserViewModel>(`organizations/${name}/users/${userId}/${visibility}`);

    if (!users) return null;

    this.ctx.executionCtx.waitUntil(this.ctx.env.KV_DATA.put(key, JSON.stringify(users)));

    return users;
  }
}
