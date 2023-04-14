import { OrganizationRoles } from './organizations.model';

export interface AuthState {
  userId: string;
  culture: string;
  organizations: OrganizationRoles[];
}
