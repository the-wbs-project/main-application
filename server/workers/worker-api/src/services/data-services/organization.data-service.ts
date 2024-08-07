import { OrganizationEntrypoint } from '../../config';
import { Organization } from '../../models';

export class OrganizationDataService {
  constructor(private readonly service: OrganizationEntrypoint) {}

  getAllAsync(): Promise<Organization[]> {
    return this.service.getAll();
  }

  getByNameAsync(name: string): Promise<Organization | undefined> {
    return this.service.getByName(name);
  }

  updateAsync(organization: Organization): Promise<void> {
    return this.service.update(organization);
  }
}
