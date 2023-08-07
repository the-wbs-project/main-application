import { Context } from '../../config';
import { AuthState } from '../../models';

export class AuthStateDataService {
  constructor(private readonly ctx: Context) {}

  getStateAsync(userId: string, jwt: string): Promise<AuthState | null> {
    const key = this.getKey(userId, jwt);

    return this.ctx.env.KV_AUTH.get<AuthState>(key, 'json');
  }

  putStateAsync(userId: string, jwt: string, state: AuthState, expiration: number): Promise<void> {
    const key = this.getKey(userId, jwt);

    return this.ctx.env.KV_AUTH.put(key, JSON.stringify(state), {
      expiration,
    });
  }

  private getKey(userId: string, jwt: string): string {
    return `STATE|${userId}|${jwt.substring(0, 200)}`;
  }
}
