import { Organization } from '../../models';

export interface OrganizationsEntrypoint {
  getAll(): Promise<Organization[]>;
  getByName(name: string): Promise<Organization>;
  update(organization: Organization): Promise<void>;
}
