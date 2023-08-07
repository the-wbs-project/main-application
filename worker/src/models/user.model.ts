export interface User {
  id: string;
  email: string;
  name: string;
  emailVerified?: boolean;
  blocked?: boolean;
  createdAt?: Date;
  lastLogin?: Date;
  loginsCount?: number;
  userInfo: UserMetadata;
}

export interface UserMetadata {
  culture: string;
}

export interface UserLite {
  id: string;
  email: string;
  name: string | null | undefined;
}
