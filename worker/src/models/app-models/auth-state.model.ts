import { Organization } from '../organization.model';
import { UserLite } from '../user.model';

export interface AuthState {
  userId: string;
  user: UserLite;
  culture: string;
  roles: string[];
  organizations: Organization[];
  organizationalRoles: Record<string, string[]>;
}
