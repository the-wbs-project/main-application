export interface UserSearchDocument {
  id: string;
  userId: string;
  visibility: string;
  orgId: string;
  orgName: string;
  orgDisplayName: string;
  fullName: string;
  email: string;
  title?: string;
  linkedIn?: string;
  twitter?: string;
  picture?: string;
  createdAt?: Date;
  lastLogin?: Date;
  loginCount?: string;
  phone?: string;
  roles: string[];
}
