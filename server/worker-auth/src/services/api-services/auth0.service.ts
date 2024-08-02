import { Env } from '../../config';
import { Member, Organization, Role, User } from '../../models';
import { Fetcher } from '../fetcher.service';
import { Logger } from '../logging';

export class Auth0Service {
  private readonly tokenService: Auth0TokenService;

  readonly memberships: Auth0OrgMembershipService;
  readonly organizations: Auth0OrganizationService;
  readonly roles: Auth0RoleService;
  readonly users: Auth0UserService;

  constructor(env: Env, fetcher: Fetcher, logger: Logger) {
    this.tokenService = new Auth0TokenService(env, fetcher, logger);
    this.memberships = new Auth0OrgMembershipService(env, fetcher, logger, this.tokenService);
    this.organizations = new Auth0OrganizationService(env, fetcher, logger, this.tokenService);
    this.roles = new Auth0RoleService(env, fetcher, logger, this.tokenService);
    this.users = new Auth0UserService(env, fetcher, logger, this.tokenService);
  }
}

class Auth0OrgMembershipService {
  constructor(
    private readonly env: Env,
    private readonly fetcher: Fetcher,
    private readonly logger: Logger,
    private readonly tokenService: Auth0TokenService,
  ) {}

  async getAllAsync(organizationId: string): Promise<Member[]> {
    const token = await this.tokenService.getToken();
    const members: Member[] = [];
    const pageSize = 5;
    let page = 0;
    let getMore = true;

    while (getMore) {
      const resp = await this.fetcher.fetch(
        `https://${this.env.AUTH_DOMAIN}/api/v2/organizations/${organizationId}/members?page=${page}&per_page=${pageSize}&fields=user_id%2Cname%2Cemail%2Cpicture%2Croles&include_fields=true`,
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

      const data: any[] = await resp.json();

      members.push(...data);
      page++;
      getMore = data.length === pageSize;
    }

    return members;
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

class Auth0OrganizationService {
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

class Auth0RoleService {
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

class Auth0UserService {
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
      body: JSON.stringify(user),
    });

    if (resp.status !== 200) {
      this.logger.trackEvent('Failed to update Auth0 user', 'Error', { status: resp.status, body: await resp.text() });

      throw new Error('Failed to update Auth0 user');
    }
  }
}

class Auth0TokenService {
  private mgmtToken?: string;
  private expiration?: Date;
  private timeLength = 15; //minutes

  constructor(private readonly env: Env, private readonly fetcher: Fetcher, private readonly logger: Logger) {}

  async getToken(): Promise<string> {
    if (!this.verifyToken()) {
      this.mgmtToken = await this.getTokenAsync();
      this.expiration = new Date();
      this.expiration.setMinutes(this.expiration.getMinutes() + this.timeLength);
    }

    return this.mgmtToken as string;
  }

  private verifyToken(): boolean {
    if (!this.mgmtToken || !this.expiration) {
      return false;
    }

    const now = new Date();
    return now < this.expiration;
  }

  private async getTokenAsync(): Promise<string> {
    var body = {
      client_id: this.env.AUTH_M2M_CLIENT_ID,
      client_secret: this.env.AUTH_M2M_CLIENT_SECRET,
      audience: this.env.AUTH_AUDIENCE,
      grant_type: 'client_credentials',
    };
    console.log(body);
    console.log(`https://${this.env.AUTH_DOMAIN}/oauth/token`);

    var resp = await this.fetcher.fetch(`https://${this.env.AUTH_DOMAIN}/oauth/token`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (resp.status !== 200) {
      this.logger.trackEvent('Failed to get Auth0 token', 'Error', { status: resp.status, body: await resp.text() });

      throw new Error('Failed to get Auth0 token');
    }
    const respBody: any = await resp.json();

    return respBody.access_token;
  }
}
