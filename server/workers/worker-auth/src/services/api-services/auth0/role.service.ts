import { Env } from '../../../config';
import { Role } from '../../../models';
import { Fetcher } from '../../fetcher.service';
import { Logger } from '../../logging';
import { Auth0TokenService } from './token.service';

export class Auth0RoleService {
  constructor(
    private readonly env: Env,
    private readonly fetcher: Fetcher,
    private readonly logger: Logger,
    private readonly tokenService: Auth0TokenService,
  ) {}

  async getAsync(): Promise<Role[]> {
    const token = await this.tokenService.getToken();

    const resp = await this.fetcher.fetch(`https://${this.env.AUTH_DOMAIN}/api/v2/roles`, {
      method: 'GET',
      headers: { Accept: 'application/json', authorization: `Bearer ${token}` },
      redirect: 'follow',
    });

    if (resp.status !== 200) {
      this.logger.trackEvent('Failed to get Auth0 roles', 'Error', { status: resp.status, body: await resp.text() });

      throw new Error('Failed to get Auth0 roles');
    }

    return await resp.json();
  }
}
