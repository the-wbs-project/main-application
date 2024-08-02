import { Organization } from '../../models';
import { Auth0Service } from '../api-services';
import { BaseDataService } from './base.data-service';

export class OrganizationDataService extends BaseDataService {
  constructor(private readonly api: Auth0Service, kv: KVNamespace, ctx: ExecutionContext) {
    super(kv, ctx);
  }

  public async getAllAsync(): Promise<Organization[]> {
    return this.getArrayAsync('ORGS', () => this.api.organizations.getAllAsync());
  }

  public async getByIdAsync(id: string): Promise<Organization | undefined | null> {
    const key = ['ORGS', id].join('|');

    return this.getDataAsync(key, () => this.api.organizations.getByIdAsync(id));
  }

  public async getByNameAsync(name: string): Promise<Organization | undefined | null> {
    const key = ['ORGS', name].join('|');

    return this.getDataAsync(key, () => this.api.organizations.getByNameAsync(name));
  }

  public async getIdFromNameAsync(name: string): Promise<string | undefined> {
    const org = await this.getByNameAsync(name);

    return org?.id;
  }

  public async updateAsync(data: Organization): Promise<void> {
    this.deleteKv(['ORGS'].join('|'), ['ORGS', data.id].join('|'), ['ORGS', data.name].join('|'));

    await this.api.organizations.updateAsync(data);
  }
}
