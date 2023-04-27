import { OrganizationRoles } from './organizations.model';

export interface AuthState {
  user: {
    id: string;
    name: string;
    email: string;
  };
  culture: string;
  organizations: OrganizationRoles[];
}
