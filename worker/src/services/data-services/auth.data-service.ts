import { Context } from '../../config';
import { Organization, Role, User, UserLite } from '../../models';
import { Transformers } from '../transformers';

export class AuthDataService {
  private readonly transformer = Transformers.users;
  private token?: string;

  constructor(private readonly ctx: Context) {}

  async getUserOrganizationsAsync(user: string): Promise<Organization[]> {
    const url = `users/${user}/organizations`;
    const response = await this.fetch(url, 'GET');

    if (response.status !== 200) throw new Error(await response.text());

    return await response.json();
  }

  async getUserRolesAsync(user: string): Promise<Role[]> {
    const url = `users/${user}/roles`;
    const response = await this.fetch(url, 'GET');

    if (response.status !== 200) throw new Error(await response.text());

    return await response.json();
  }

  async getOrganizationalUsersAsync(organization: string): Promise<UserLite[]> {
    const response = await this.fetch(`organizations/${organization}/members`, 'GET');

    if (response.status !== 200) throw new Error(await response.text());

    return await response.json();
  }

  async getUserOrganizationalRolesAsync(organization: string, user: string): Promise<Role[]> {
    const response = await this.fetch(`organizations/${organization}/members/${user}/roles`, 'GET');

    if (response.status !== 200) throw new Error(await response.text());

    return await response.json();
  }

  async updateProfileAsync(user: User): Promise<void> {
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
    const response = await this.fetch(`users/${user.id}`, 'PATCH', {
      blocked: user.blocked,
    });
    if (response.status !== 200) {
      const message = await response.text();

      throw new Error(`${response.status}: ${message}`);
    }
  }

  async getUserAsync(userId: string): Promise<User> {
    const url = `users/${userId}`;
    const response = await this.fetch(url, 'GET');

    if (response.status !== 200) throw new Error(await response.text());

    return this.transformer.toModel(await response.json());
  }

  async getUsersByIdAsync(userIds: string[]): Promise<UserLite[]> {
    const query = this.buildQueryForIds(userIds);
    const count = await this.getUserCountAsync(query);
    const list: UserLite[] = [];
    let page = 0;
    const size = 50;

    while (list.length < count) {
      const results = await this.makeUserCall(query, page, size, ['email', 'name', 'user_id']);

      for (const user of results) {
        list.push(this.transformer.toLiteModel(user));
      }
      page++;
    }
    return list;
  }

  async getUsersByEmailAsync(emails: string[]): Promise<UserLite[]> {
    const query = this.buildQueryForEmails(emails);
    const count = await this.getUserCountAsync(query);
    const list: UserLite[] = [];
    let page = 0;
    const size = 50;

    while (list.length < count) {
      const results = await this.makeUserCall(query, page, size, ['email', 'name', 'user_id']);

      for (const user of results) {
        list.push(this.transformer.toLiteModel(user));
      }
      page++;
    }
    return list;
  }

  private async makeUserCall(query: string, pageNumber: number, pageSize: number, fields?: string[]): Promise<any> {
    let url = `${this.usersPrefix(query)}&page=${pageNumber}&per_page=${pageSize}`;

    if (fields) {
      url += `&fields=${fields.join(',')}`;
    }
    const response = await this.fetch(url, 'GET');

    if (response.status !== 200) throw new Error(await response.text());

    return await response.json<any>();
  }

  private async getUserCountAsync(query: string): Promise<number> {
    const url = `${this.usersPrefix(query)}&include_totals=true`;
    const response = await this.fetch(url, 'GET');

    if (response.status !== 200) throw new Error(await response.text());

    return (await response.json<any>()).total;
  }

  private usersPrefix(query: string): string {
    return `users?sort=last_login:-1&search_engine=v3&q=${query}`;
  }

  private buildQueryForIds(ids: string[]): string {
    const params: string[] = [];

    for (const id of ids) params.push(`user_id%3D${id.replace('|', '%7C')}`);

    return params.join('%20OR%20');
  }

  private buildQueryForEmails(emails: string[]): string {
    const params: string[] = [];

    for (const email of emails) params.push(`email%3D${email.replace('@', '%40')}`);

    return params.join('%20OR%20');
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
}
