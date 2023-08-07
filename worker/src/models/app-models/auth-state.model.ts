import { Organization } from '../organization.model';
import { Role } from '../role.model';
import { UserLite } from '../user.model';

export interface AuthState {
  user: UserLite;
  culture: string;
  roles: Role[];
  organizations: Organization[];
  organizationalRoles: Record<string, Role[]>;
}
