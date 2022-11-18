import { AuthState } from '../models';
import { CloudflareDataService } from './cloudflare-data.service';

export class AuthDataService {
  constructor(private readonly edge: CloudflareDataService) {}

  getStateAsync(code: string): Promise<AuthState | null> {
    return this.edge.get<AuthState>(`STATE|${code}`, 'json');
  }

  putStateAsync(code: string, state: AuthState): Promise<void> {
    return this.edge.put(`STATE|${code}`, JSON.stringify(state), {
      expirationTtl: state.exp ? undefined : 2678400,
      expiration: state.exp,
    });
  }

  deleteStateAsync(code: string): Promise<void> {
    return this.edge.delete(`STATE|${code}`);
  }
}
