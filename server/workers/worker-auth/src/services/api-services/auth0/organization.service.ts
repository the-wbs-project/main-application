import { Env } from '../../../config';
import { Organization } from '../../../models';
import { Fetcher } from '../../fetcher.service';
import { Logger } from '../../logging';
import { Auth0TokenService } from './token.service';

export class Auth0OrganizationService {
  constructor(
    private readonly env: Env,
    private readonly fetcher: Fetcher,
    private readonly logger: Logger,
    private readonly tokenService: Auth0TokenService,
  ) {}

  async getAllAsync(): Promise<Organization[]> {
    console.log('getting all');
    const token = await this.tokenService.getToken();
    const resp = await this.fetcher.fetch(`https://${this.env.AUTH_DOMAIN}/api/v2/organizations`, {
      method: 'GET',
      headers: { Accept: 'application/json', authorization: `Bearer ${token}` },
      redirect: 'follow',
    });

    if (resp.status !== 200) {
      this.logger.trackEvent('Failed to get Auth0 organizations', 'Error', { status: resp.status, body: await resp.text() });

      throw new Error('Failed to get Auth0 organizations');
    }

    return await resp.json();
  }

  async getByIdAsync(id: string): Promise<Organization | undefined> {
    const token = await this.tokenService.getToken();
    const resp = await this.fetcher.fetch(`https://${this.env.AUTH_DOMAIN}/api/v2/organizations/${id}`, {
      method: 'GET',
      headers: { Accept: 'application/json', authorization: `Bearer ${token}` },
      redirect: 'follow',
    });

    if (resp.status === 404) return undefined;
    if (resp.status !== 200) {
      this.logger.trackEvent('Failed to get Auth0 organization by id', 'Error', { status: resp.status, body: await resp.text() });

      throw new Error('Failed to get Auth0 organization by id');
    }

    return await resp.json();
  }

  async getByNameAsync(name: string): Promise<Organization | undefined> {
    const token = await this.tokenService.getToken();

    const resp = await this.fetcher.fetch(`https://${this.env.AUTH_DOMAIN}/api/v2/organizations/name/${name}`, {
      method: 'GET',
      headers: { Accept: 'application/json', authorization: `Bearer ${token}` },
      redirect: 'follow',
    });

    if (resp.status === 404) return undefined;
    if (resp.status !== 200) {
      this.logger.trackEvent('Failed to get Auth0 organization by name', 'Error', { status: resp.status, body: await resp.text() });

      throw new Error('Failed to get Auth0 organization by name');
    }

    return await resp.json();
  }

  async updateAsync(organization: Organization): Promise<void> {
    const token = await this.tokenService.getToken();

    const resp = await this.fetcher.fetch(`https://${this.env.AUTH_DOMAIN}/api/v2/organizations/${organization.id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
      redirect: 'follow',
      body: JSON.stringify(organization),
    });

    if (resp.status !== 200) {
      this.logger.trackEvent('Failed to update Auth0 organization', 'Error', { status: resp.status, body: await resp.text() });

      throw new Error('Failed to update Auth0 organization');
    }

    return await resp.json();
  }
}
