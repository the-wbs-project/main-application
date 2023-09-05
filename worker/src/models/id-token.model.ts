import { Organization } from './organization.model';

export interface IdToken {
  userId: string;
  roles: string[];
  organizations: Organization[];
  orgRoles: { [key: string]: string[] };
}
