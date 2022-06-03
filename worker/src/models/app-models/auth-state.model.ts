export interface AuthState {
  userId?: string;
  culture?: string;
  organizations?: string[];
  organization?: string;
  roles?: string[];
  exp?: number;
}
