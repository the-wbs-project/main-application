import { Env } from '../../config';
import { Organization } from '../../models';
import { OriginService } from '../origin-services';
import { BaseDataService } from './base.data-service';

export class OrganizationDataService extends BaseDataService {
  private readonly key = 'ORGS';

  constructor(env: Env, executionCtx: ExecutionContext, origin: OriginService) {
    super(env, executionCtx, origin);
  }

  async getAllAsync(): Promise<Organization[]> {
    const kvData = await this.getKv<Organization[]>(this.key);

    if (kvData) return kvData;

    const apiData = await this.origin.getAsync<Organization[]>('organizations');

    if (!apiData || apiData.length === 0) return [];

    this.putKv(this.key, apiData);

    return apiData;
  }

  async getByIdAsync(id: string): Promise<Organization | undefined> {
    return (await this.getAllAsync()).find((x) => x.id === id);
  }

  async update(organization: Organization): Promise<void> {
    //
    //  Save to server
    //
    const resp = await this.origin.putAsync(organization, `organizations/${organization.id}`);

    if (resp.status >= 300) {
      throw new Error('Un error occured trying to save the organization: ' + resp.status);
    }
    //
    //  Save to KV
    //
    const list = (await this.getKv<Organization[]>(this.key)) ?? [];
    const index = list.findIndex((x) => x.id === organization.id);

    if (index === -1) list.push(organization);
    else list[index] = organization;

    this.putKv(this.key, list);
  }
}
