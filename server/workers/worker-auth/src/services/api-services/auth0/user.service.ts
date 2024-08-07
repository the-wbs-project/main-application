import { Env } from '../../../config';
import { Organization, Role, User } from '../../../models';
import { Fetcher } from '../../fetcher.service';
import { Logger } from '../../logging';
import { Auth0TokenService } from './token.service';

export class Auth0UserService {
  constructor(
    private readonly env: Env,
    private readonly fetcher: Fetcher,
    private readonly logger: Logger,
    private readonly tokenService: Auth0TokenService,
  ) {}

  async getAsync(userId: string): Promise<User | undefined> {
    const token = await this.tokenService.getToken();

    const resp = await this.fetcher.fetch(`https://${this.env.AUTH_DOMAIN}/api/v2/users/${userId}`, {
      method: 'GET',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
      redirect: 'follow',
    });

    if (resp.status === 404) return undefined;
    if (resp.status !== 200) {
      this.logger.trackEvent('Failed to get Auth0 user', 'Error', { status: resp.status, body: await resp.text() });

      throw new Error('Failed to get Auth0 user');
    }

    return await resp.json();
  }

  async getSiteRolesAsync(userId: string): Promise<Role[]> {
    const token = await this.tokenService.getToken();

    const resp = await this.fetcher.fetch(`https://${this.env.AUTH_DOMAIN}/api/v2/users/${userId}/roles`, {
      method: 'GET',
      headers: { Accept: 'application/json', authorization: `Bearer ${token}` },
      redirect: 'follow',
    });

    if (resp.status !== 200) {
      this.logger.trackEvent('Failed to get Auth0 user site roles', 'Error', { status: resp.status, body: await resp.text() });

      throw new Error('Failed to get Auth0 user site roles');
    }

    return await resp.json();
  }

  async getMembershipsAsync(userId: string): Promise<Organization[]> {
    const token = await this.tokenService.getToken();

    const resp = await this.fetcher.fetch(`https://${this.env.AUTH_DOMAIN}/api/v2/users/${userId}/organizations`, {
      method: 'GET',
      headers: { Accept: 'application/json', authorization: `Bearer ${token}` },
      redirect: 'follow',
    });

    if (resp.status !== 200) {
      this.logger.trackEvent('Failed to get Auth0 user memberships', 'Error', { status: resp.status, body: await resp.text() });

      throw new Error('Failed to get Auth0 user memberships');
    }

    return await resp.json();
  }

  async updateAsync(user: User): Promise<void> {
    const token = await this.tokenService.getToken();

    const resp = await this.fetcher.fetch(`https://${this.env.AUTH_DOMAIN}/api/v2/users/${user.user_id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
      redirect: 'follow',
      body: JSON.stringify({
        name: user.name,
        picture: user.picture,
        user_metadata: user.user_metadata,
      }),
    });

    if (resp.status !== 200) {
      this.logger.trackEvent('Failed to update Auth0 user', 'Error', { status: resp.status, body: await resp.text() });

      throw new Error('Failed to update Auth0 user');
    }
  }
}
