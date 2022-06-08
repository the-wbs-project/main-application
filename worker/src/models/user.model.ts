export interface User {
  id?: string;
  email?: string;
  emailVerified?: boolean;
  name?: string | null | undefined;
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
  roles: string[];
}
