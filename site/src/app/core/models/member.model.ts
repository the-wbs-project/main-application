import { Role } from './role.model';

export interface Member {
  userId: string;
  email: string;
  picture?: string;
  fullName: string;
  roles: Role[];
}
