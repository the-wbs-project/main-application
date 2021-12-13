import { AuthState } from '../../models';

export interface AuthDataService {
  getStateAsync(code: string): Promise<AuthState>;
  putStateAsync(code: string, state: AuthState): Promise<void>;
}
