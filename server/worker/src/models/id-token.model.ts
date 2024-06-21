import { Organization } from './organization.model';

export interface IdToken {
  userId: string;
  siteRoles: string[];
  organizations: Organization[];
  orgRoles: { [key: string]: string[] };
}
