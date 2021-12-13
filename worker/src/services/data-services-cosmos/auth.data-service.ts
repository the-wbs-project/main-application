import { AuthState } from '../../models';
import { AuthDataService } from '../data-services';

export class AuthCosmosDataService implements AuthDataService {
  async getStateAsync(code: string): Promise<AuthState> {
    const kv = await KVAUTH.get(`STATE|${code}`);

    return kv ? JSON.parse(kv) : null;
  }

  putStateAsync(code: string, state: AuthState): Promise<void> {
    return KVAUTH.put(`STATE|${code}`, JSON.stringify(state), {
      expirationTtl: 2678400,
    });
  }
}
