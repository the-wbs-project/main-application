import { Organization } from './organization.model';
import { Role } from './role.model';

export interface IdToken {
  userId: string;
  siteRoles: string[];
  organizations: Organization[];
  roles: Role[];
  orgRoles: { [key: string]: string[] };
}
