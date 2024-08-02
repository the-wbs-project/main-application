export interface UserViewModel {
  userId: string;
  fullName: string;
  email: string;
  title?: string;
  linkedIn?: string;
  twitter?: string;
  picture?: string;
  createdAt?: Date;
  lastLogin?: Date;
  loginCount?: string;
  phase?: string;
  roles: string[];
}
