import { Context } from '../../config';
import { Organization, Role, User, UserLite } from '../../models';
import { Transformers } from '../transformers';

export class AuthDataService {
  private readonly transformer = Transformers.users;
  private token?: string;

  constructor(private readonly ctx: Context) { }

  async getUserOrganizationsAsync(user: string): Promise<Organization[]> {
    let organizations = await this.getStateAsync<Organization[]>([user, 'organizations']);

    if (organizations) return organizations;

    const url = `users/${user}/organizations`;
    const response = await this.fetch(url, 'GET');

    if (response.status !== 200) throw new Error(await response.text());

    organizations = await response.json();

    this.putStateAsync([user, 'organizations'], organizations, 60 * 2);

    return organizations ?? [];
  }

  async getUserRolesAsync(user: string): Promise<string[]> {
    let roles = await this.getStateAsync<string[]>([user, 'roles']);

    if (roles) return roles;

    const url = `users/${user}/roles`;
    const response = await this.fetch(url, 'GET');

    if (response.status !== 200) throw new Error(await response.text());

    const rolesObj: Role[] = await response.json();

    roles = rolesObj.map((x) => x.name);

    this.putStateAsync([user, 'roles'], roles, 60 * 1);

    return roles;
  }

  async getOrganizationalUsersAsync(organization: string): Promise<UserLite[]> {
    let members = await this.getStateAsync<UserLite[]>([organization, 'members']);

    if (members) return members;

    const response = await this.fetch(`organizations/${organization}/members`, 'GET');

    if (response.status !== 200) throw new Error(await response.text());

    const users: Record<string, any>[] = await response.json();

    members = users.map((x) => this.transformer.toUserLite(x));

    this.putStateAsync([organization, 'members'], members, 60 * 2);

    return members;
  }

  async getUserOrganizationalRolesAsync(organization: string, user: string): Promise<string[]> {
    let roles = await this.getStateAsync<string[]>([organization, user, 'roles']);

    if (roles) return roles;

    const response = await this.fetch(`organizations/${organization}/members/${user}/roles`, 'GET');

    if (response.status !== 200) throw new Error(await response.text());

    const roleObjs: Role[] = await response.json();

    roles = roleObjs.map((x) => x.name);

    this.putStateAsync([organization, user, 'roles'], roles, 60 * 1);

    return roles;
  }

  async addUserOrganizationalRolesAsync(organization: string, user: string, roles: string[]): Promise<void> {
    const response = await this.fetch(`organizations/${organization}/members/${user}/roles`, 'POST', {
      roles,
    });

    if (response.status !== 204) throw new Error(await response.text());

    this.deleteStateAsync([organization, user, 'roles']);
  }

  async removeUserOrganizationalRolesAsync(organization: string, user: string, roles: string[]): Promise<void> {
    const response = await this.fetch(`organizations/${organization}/members/${user}/roles`, 'DELETE', {
      roles,
    });

    if (response.status !== 204) throw new Error(await response.text());

    this.deleteStateAsync([organization, user, 'roles']);
  }

  async removeUserFromOrganizationAsync(organization: string, user: string): Promise<void> {
    const response = await this.fetch(`organizations/${organization}/members`, 'DELETE', {
      members: [user],
    });

    if (response.status !== 204) throw new Error(await response.text());

    this.deleteStateAsync([organization, user, 'roles']);
    this.deleteStateAsync([organization, 'members']);
    this.deleteStateAsync([user, 'organizations']);
  }

  async updateProfileAsync(user: User): Promise<void> {
    this.deleteStateAsync([user.id, 'user']);

    const response = await this.fetch(`users/${user.id}`, 'PATCH', {
      name: user.name,
      user_metadata: user.userInfo,
    });
    if (response.status !== 200) {
      const message = await response.text();

      throw new Error(`${response.status}: ${message}`);
    }
  }

  async updateUserAsync(user: User): Promise<void> {
    this.deleteStateAsync([user.id, 'user']);

    const response = await this.fetch(`users/${user.id}`, 'PATCH', {
      blocked: user.blocked,
    });
    if (response.status !== 200) {
      const message = await response.text();

      throw new Error(`${response.status}: ${message}`);
    }
  }

  async getUserAsync(userId: string): Promise<User> {
        let user = await this.getStateAsync<User>([userId, 'user']);

    if (user) return user;

    const url = `users/${userId}`;
    const response = await this.fetch(url, 'GET');
    
    if (response.status !== 200) throw new Error(await response.text());

    user = this.transformer.toModel(await response.json());

    this.putStateAsync([userId, 'user'], user, 60 * 10);

    return user;
  }

  async getLiteUserAsync(userId: string): Promise<UserLite> {
    const user = await this.getUserAsync(userId);

    return {
      email: user.email,
      id: user.id,
      name: user.name,
    };
  }

  async getUsers(pageNumber: number, pageSize: number, fields?: string[]): Promise<UserLite[]> {
    let url = `users?sort=last_login:-1&search_engine=v3&page=${pageNumber}&per_page=${pageSize}`;

    if (fields) {
      url += `&fields=${fields.join(',')}`;
    }
    const response = await this.fetch(url, 'GET');

    if (response.status !== 200) throw new Error(await response.text());

    const list: UserLite[] = [];
    const results = await response.json<any>();

    for (const user of results) {
      list.push(this.transformer.toUserLite(user));
    }

    return list;
  }

  private async fetch(urlSuffix: string, method: string, body?: unknown): Promise<Response> {
    await this.verifyTokenAsync();
    
    return await this.ctx.get('fetcher').fetch(
      new Request(`https://${this.ctx.env.AUTH_DOMAIN}/api/v2/${urlSuffix}`, {
        method,
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
        body: body ? JSON.stringify(body) : undefined,
      }),
    );
  }

  private async verifyTokenAsync(): Promise<void> {
    if (this.token) return;

    const url = `https://${this.ctx.env.AUTH_DOMAIN}/oauth/token`;
    const body = {
      client_id: this.ctx.env.AUTH_CLIENT_ID,
      client_secret: this.ctx.env.AUTH_CLIENT_SECRET,
      audience: this.ctx.env.AUTH_AUDIENCE,
      grant_type: 'client_credentials',
    };
    const response = await this.ctx.get('fetcher').fetch(
      new Request(url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(body),
      }),
    );

    if (response.status !== 200) {
      throw new Error(await response.text());
    }
    const respBody: { access_token: string } = await response.json();

    this.token = respBody.access_token;
  }

  private getStateAsync<T>(parts: string[]): Promise<T | null> {
    return this.ctx.env.KV_AUTH.get<T>(this.key(parts), 'json');
  }

  private putStateAsync<T>(parts: string[], value: T, expirationTtl: number): void {
        if (value === null) {
      this.deleteStateAsync(parts);
      return;
    }
    const value2 = typeof value === 'string' ? value : typeof value === 'number' ? value.toString() : JSON.stringify(value);

    this.ctx.executionCtx.waitUntil(
      this.ctx.env.KV_AUTH.put(this.key(parts), value2, {
        expirationTtl,
      }),
    );
  }

  private deleteStateAsync(parts: string[]): void {
    this.ctx.executionCtx.waitUntil(this.ctx.env.KV_AUTH.delete(this.key(parts)));
  }

  private key(parts: string[]): string {
    return parts.map((x) => x.replace('auth0|', '')).join('|');
  }
}
