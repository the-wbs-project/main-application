import { ROLES_TYPE } from '../models';

export interface ProjectUserViewModel {
  name: string;
  role: ROLES_TYPE;
  email: string;
  phone: string;
}
