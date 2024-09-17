import { Role } from './role.model';

export interface Member {
  user_id: string;
  email: string;
  picture?: string;
  name: string;
  roles: Role[];
}
