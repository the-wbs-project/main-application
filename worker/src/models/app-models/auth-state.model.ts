export interface AuthState {
  userId?: string;
  claims?: string[];
  culture?: string;
  organizations?: string[];
  exp?: number;
}
