import { ROLES_TYPE } from '@wbs/core/models';

export interface UserRolesViewModel {
  id: string;
  name: string;
  email: string;
  roles: ROLES_TYPE[];
}
