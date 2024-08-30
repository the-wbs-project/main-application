import { Role } from '../models';

export interface UserViewModel {
  userId: string;
  fullName: string;
  email: string;
  title?: string;
  linkedIn?: string;
  twitter?: string;
  picture?: string;
  createdAt?: string;
  updatedAt?: string;
  lastLogin?: string;
  loginCount?: number;
  phone?: string;
  roles: Role[];
}
