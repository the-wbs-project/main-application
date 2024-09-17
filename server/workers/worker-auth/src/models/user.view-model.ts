import { Role } from './role.model';

export interface UserViewModel {
  userId: string;
  fullName: string;
  email: string;
  title?: string;
  linkedIn?: string;
  twitter?: string;
  picture?: string;
  phone?: string;
  roles: Role[];
}
