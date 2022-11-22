import { AuthState } from './auth-state.model';
import { OrganizationRoles } from './organizations.model';

export interface AuthResults {
  state?: AuthState | null;
  roles?: OrganizationRoles;
}
