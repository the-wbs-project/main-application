import { Resource } from '@cfworker/cosmos';

export interface MembershipDbModel extends Resource {
  organization: string;
  roles: string[];
  isActive: boolean;
}
