import { Organization } from './organization.model';

export interface Membership extends Organization {
  roles: string[];
}
