export interface User {
  id?: string;
  email?: string;
  emailVerified?: boolean;
  fullName?: string;
  blocked?: boolean;
  createdAt?: Date;
  lastLogin?: Date;
  loginsCount?: number;
  //userInfo?: UserMetadata;
  //appInfo?: UserAppMetadata;
}

export interface UserMetadata {
  phone: string;
}

export interface UserAppMetadata {
  role: string;
}