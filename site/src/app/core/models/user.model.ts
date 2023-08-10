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
}

export interface UserMetadata {
  culture?: string;
}
