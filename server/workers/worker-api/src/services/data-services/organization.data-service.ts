import { AuthEntrypoint, OrganizationsEntrypoint } from '../../config';
import { Organization } from '../../models';

export class OrganizationDataService {
  constructor(private readonly authApi: AuthEntrypoint) {}

  async getAllAsync(): Promise<Organization[]> {
    return (await this.service()).getAll();
  }

  async getByNameAsync(name: string): Promise<Organization | undefined> {
    return (await this.service()).getByName(name);
  }

  async updateAsync(organization: Organization): Promise<void> {
    return (await this.service()).update(organization);
  }

  private async service(): Promise<OrganizationsEntrypoint> {
    return this.authApi.organizations();
  }
}
