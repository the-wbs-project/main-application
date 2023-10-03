export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  createdAt?: Date;
  lastLogin?: Date;
  loginCount?: number;
}
