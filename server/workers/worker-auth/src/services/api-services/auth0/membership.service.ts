import { Env } from '../../../config';
import { Role } from '../../../models';
import { Fetcher } from '../../fetcher.service';
import { Logger } from '../../logging';
import { Auth0TokenService } from './token.service';

export class Auth0MembershipService {
  constructor(
    private readonly env: Env,
    private readonly fetcher: Fetcher,
    private readonly logger: Logger,
    private readonly tokenService: Auth0TokenService,
  ) {}

  async getAllAsync(organizationId: string): Promise<string[]> {
    const token = await this.tokenService.getToken();
    const memberIds: string[] = [];
    const pageSize = 5;
    let page = 0;
    let getMore = true;

    while (getMore) {
      const resp = await this.fetcher.fetch(
        `https://${this.env.AUTH_DOMAIN}/api/v2/organizations/${organizationId}/members?page=${page}&per_page=${pageSize}&fields=user_id&include_fields=true`,
        {
          method: 'GET',
          headers: { Accept: 'application/json', authorization: `Bearer ${token}` },
          redirect: 'follow',
        },
      );

      if (resp.status !== 200) {
        this.logger.trackEvent('Failed to get Auth0 organization members', 'Error', { status: resp.status, body: await resp.text() });

        throw new Error('Failed to get Auth0 organization members');
      }

      const data: { user_id: string }[] = await resp.json();

      memberIds.push(...data.map((m) => m.user_id));
      page++;
      getMore = data.length === pageSize;
    }

    return memberIds;
  }

  async getRolesAsync(organization: string, userId: string): Promise<Role[]> {
    const token = await this.tokenService.getToken();

    const resp = await this.fetcher.fetch(`https://${this.env.AUTH_DOMAIN}/api/v2/organizations/${organization}/members/${userId}/roles`, {
      method: 'GET',
      headers: { Accept: 'application/json', authorization: `Bearer ${token}` },
      redirect: 'follow',
    });

    if (resp.status !== 200) {
      this.logger.trackEvent('Failed to get Auth0 organization member roles', 'Error', { status: resp.status, body: await resp.text() });

      throw new Error('Failed to get Auth0 organization member roles');
    }

    return await resp.json();
  }

  async addAsync(organizationId: string, members: string[]): Promise<void> {
    const token = await this.tokenService.getToken();

    const resp = await this.fetcher.fetch(`https://${this.env.AUTH_DOMAIN}/api/v2/organizations/${organizationId}/members`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
      redirect: 'follow',
      body: JSON.stringify({ members }),
    });

    if (resp.status !== 204) {
      this.logger.trackEvent('Failed to add Auth0 organization member', 'Error', { status: resp.status, body: await resp.text() });

      throw new Error('Failed to add Auth0 organization member');
    }
  }

  async deleteAsync(organizationId: string, members: string[]): Promise<void> {
    const token = await this.tokenService.getToken();

    const resp = await this.fetcher.fetch(`https://${this.env.AUTH_DOMAIN}/api/v2/organizations/${organizationId}/members`, {
      method: 'DELETE',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
      redirect: 'follow',
      body: JSON.stringify({ members }),
    });

    if (resp.status !== 204) {
      this.logger.trackEvent('Failed to delete Auth0 organization member', 'Error', { status: resp.status, body: await resp.text() });

      throw new Error('Failed to delete Auth0 organization member');
    }
  }

  async addToRolesAsync(organizationId: string, userId: string, roles: string[]): Promise<void> {
    const token = await this.tokenService.getToken();

    const resp = await this.fetcher.fetch(
      `https://${this.env.AUTH_DOMAIN}/api/v2/organizations/${organizationId}/members/${userId}/roles`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
        redirect: 'follow',
        body: JSON.stringify({ roles }),
      },
    );

    if (resp.status !== 204) {
      this.logger.trackEvent('Failed to add Auth0 organization member role', 'Error', { status: resp.status, body: await resp.text() });

      throw new Error('Failed to add Auth0 organization member role');
    }
  }

  async deleteFromRolesAsync(organizationId: string, userId: string, roles: string[]): Promise<void> {
    const token = await this.tokenService.getToken();

    const resp = await this.fetcher.fetch(
      `https://${this.env.AUTH_DOMAIN}/api/v2/organizations/${organizationId}/members/${userId}/roles`,
      {
        method: 'DELETE',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
        redirect: 'follow',
        body: JSON.stringify({ roles }),
      },
    );

    if (resp.status !== 204) {
      this.logger.trackEvent('Failed to delete Auth0 organization member role', 'Error', { status: resp.status, body: await resp.text() });

      throw new Error('Failed to delete Auth0 organization member role');
    }
  }
}
