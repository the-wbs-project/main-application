import { Env } from '../../../config';
import { Invite, InviteBody } from '../../../models';
import { Fetcher } from '../../fetcher.service';
import { Logger } from '../../logging';
import { Auth0TokenService } from './token.service';

export class Auth0InviteService {
  constructor(
    private readonly env: Env,
    private readonly fetcher: Fetcher,
    private readonly logger: Logger,
    private readonly tokenService: Auth0TokenService,
  ) {}

  async getAllAsync(organizationId: string): Promise<Invite[]> {
    const token = await this.tokenService.getToken();
    const invites: Invite[] = [];
    const pageSize = 50;
    let page = 0;
    let getMore = true;

    while (getMore) {
      const resp = await this.fetcher.fetch(
        `https://${this.env.AUTH_DOMAIN}/api/v2/organizations/${organizationId}/invitations?page=${page}&per_page=${pageSize}`,
        {
          method: 'GET',
          headers: { Accept: 'application/json', authorization: `Bearer ${token}` },
          redirect: 'follow',
        },
      );

      if (resp.status !== 200) {
        this.logger.trackEvent('Failed to get Auth0 organization invites', 'Error', { status: resp.status, body: await resp.text() });

        throw new Error('Failed to get Auth0 organization invites');
      }
      const respData = (await resp.json()) as any[];

      for (const data of respData) {
        invites.push({
          id: data.id,
          createdAt: data.created_at,
          expiresAt: data.expires_at,
          invitee: data.invitee.email,
          inviter: data.inviter.name,
          roles: data.roles,
        });
      }

      page++;
      getMore = respData.length === pageSize;
    }

    return invites;
  }

  async createAsync(organizationId: string, inviteBody: InviteBody): Promise<void> {
    const token = await this.tokenService.getToken();

    const resp = await this.fetcher.fetch(`https://${this.env.AUTH_DOMAIN}/api/v2/organizations/${organizationId}/invitations`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
      body: JSON.stringify({
        inviter: {
          name: inviteBody.inviter,
        },
        invitee: {
          email: inviteBody.invitee,
        },
        client_id: this.env.AUTH_M2M_CLIENT_ID,
        connection_id: 'Username-Password-Authentication',
        ttl_sec: 0,
        roles: inviteBody.roles,
        send_invitation_email: true,
      }),
      redirect: 'follow',
    });

    if (resp.status !== 201) {
      this.logger.trackEvent('Failed to create invite', 'Error', { status: resp.status, body: await resp.text() });

      throw new Error('Failed to create invite.');
    }
  }

  async deleteAsync(organizationId: string, invitationId: string): Promise<void> {
    const token = await this.tokenService.getToken();

    //organizations/:id/invitations/:invitation_id
    const resp = await this.fetcher.fetch(
      `https://${this.env.AUTH_DOMAIN}/api/v2/organizations/${organizationId}/invitations/${invitationId}`,
      {
        method: 'DELETE',
        headers: { Accept: 'application/json', authorization: `Bearer ${token}` },
        redirect: 'follow',
      },
    );

    if (resp.status !== 200) {
      this.logger.trackEvent('Failed to delete invite', 'Error', { status: resp.status, body: await resp.text() });

      throw new Error('Failed to cancel invite.');
    }
  }
}
