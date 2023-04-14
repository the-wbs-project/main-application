export interface UserLite {
  id: string;
  email: string;
  name: string;
}

export interface User {
  id: string;
  email: string;
  emailVerified?: boolean;
  name: string;
  blocked?: boolean;
  createdAt?: Date;
  lastLogin?: Date;
  loginsCount?: number;
  userInfo: UserMetadata;
  appInfo: UserAppMetadata;
}

export interface UserMetadata {
  culture?: string;
}

export interface UserAppMetadata {
  inviteCode?: string;
  organizationRoles?: OrganizationRoles[];
}

export interface OrganizationRoles {
  organization: string;
  roles: string[];
}
