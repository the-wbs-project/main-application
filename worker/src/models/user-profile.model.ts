export interface UserProfile {
  userId: string;
  email: string;
  fullName: string;
  title?: string;
  linkedIn?: string;
  twitter?: string;
  picture?: string;
  createdAt?: string;
  updatedAt?: string;
  lastLogin?: string;
  loginCount?: number;
  phone?: string;
  showExternally?: string[];
}
