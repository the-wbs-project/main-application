export interface AuthState {
  exists: true;
  code?: string;
  identity?: any;
  verified: boolean;
  updatedValues?: Record<string, string | null | undefined>;
  sessionId?: string;
}
