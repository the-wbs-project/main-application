export interface AuthState {
  exists: true;
  code?: string;
  identity?: any;
  verified: boolean;
  updatedValues?: { [key: string]: string | null | undefined };
  sessionId?: string;
}
