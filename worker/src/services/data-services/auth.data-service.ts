import { AuthState } from '../../models';
import { EdgeDataService } from '../edge-services';

export class AuthDataService {
  constructor(private readonly edge: EdgeDataService) {}

  getStateAsync(userId: string, jwt: string): Promise<AuthState | null> {
    const key = this.getKey(userId, jwt);

    return this.edge.get<AuthState>(key, 'json');
  }

  putStateAsync(userId: string, jwt: string, state: AuthState, expiration: number): Promise<void> {
    const key = this.getKey(userId, jwt);

    return this.edge.put(key, JSON.stringify(state), {
      expiration,
    });
  }

  private getKey(userId: string, jwt: string): string {
    return `STATE|${userId}|${jwt.substring(0, 200)}`;
  }
}
