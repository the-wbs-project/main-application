import { ROLES_TYPE } from '@wbs/shared/models';

export interface UserRole {
  role: ROLES_TYPE;
  userId: string;
}
