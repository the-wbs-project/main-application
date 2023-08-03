import { Context } from '../../config';
import { User, UserLite } from '../../models';
import { Auth0Service } from './auth0.service';

export class IdentityService {
  static async updateProfileAsync(ctx: Context, user: User): Promise<void> {
    const token = await Auth0Service.getMgmtTokenAsync(ctx);
    const response = await Auth0Service.makeAuth0CallAsync(ctx, `users/${user.id}`, 'PATCH', token, {
      name: user.name,
      user_metadata: user.userInfo,
    });
    if (response.status !== 200) {
      const message = await response.text();

      throw new Error(`${response.status}: ${message}`);
    }
  }

  static async updateUserAsync(ctx: Context, user: User): Promise<void> {
    const token = await Auth0Service.getMgmtTokenAsync(ctx);
    const response = await Auth0Service.makeAuth0CallAsync(ctx, `users/${user.id}`, 'PATCH', token, {
      blocked: user.blocked,
    });
    if (response.status !== 200) {
      const message = await response.text();

      throw new Error(`${response.status}: ${message}`);
    }
  }

  static async getUserAsync(ctx: Context, userId: string): Promise<User> {
    const url = `users/${userId}`;
    const token = await Auth0Service.getMgmtTokenAsync(ctx);
    const response = await Auth0Service.makeAuth0CallAsync(ctx, url, 'GET', token);

    if (response.status !== 200) throw new Error(await response.text());

    const user = Auth0Service.toUser(await response.json());

    return user;
  }

  static async getUsersByIdAsync(ctx: Context, userIds: string[]): Promise<UserLite[]> {
    const token = await Auth0Service.getMgmtTokenAsync(ctx);
    const query = this.buildQueryForIds(userIds);
    const count = await this.getUserCountAsync(ctx, token, query);
    const list: UserLite[] = [];
    let page = 0;
    const size = 50;

    while (list.length < count) {
      const results = await this.makeUserCall(ctx, token, query, page, size, ['email', 'name', 'user_id']);

      for (const user of results) {
        list.push(Auth0Service.toLiteUser(user));
      }
      page++;
    }
    return list;
  }

  static async getUsersByEmailAsync(ctx: Context, emails: string[]): Promise<UserLite[]> {
    const token = await Auth0Service.getMgmtTokenAsync(ctx);
    const query = this.buildQueryForEmails(emails);
    const count = await this.getUserCountAsync(ctx, token, query);
    const list: UserLite[] = [];
    let page = 0;
    const size = 50;

    while (list.length < count) {
      const results = await this.makeUserCall(ctx, token, query, page, size, ['email', 'name', 'user_id']);

      for (const user of results) {
        list.push(Auth0Service.toLiteUser(user));
      }
      page++;
    }
    return list;
  }

  private static async makeUserCall(
    ctx: Context,
    token: string,
    query: string,
    pageNumber: number,
    pageSize: number,
    fields?: string[],
  ): Promise<any> {
    let url = `${this.usersPrefix(query)}&page=${pageNumber}&per_page=${pageSize}`;

    if (fields) {
      url += `&fields=${fields.join(',')}`;
    }
    const response = await Auth0Service.makeAuth0CallAsync(ctx, url, 'GET', token);
    const results: UserLite[] = [];

    if (response.status !== 200) throw new Error(await response.text());

    return await response.json<any>();
  }

  private static async getUserCountAsync(ctx: Context, token: string, query: string): Promise<number> {
    const url = `${this.usersPrefix(query)}&include_totals=true`;
    const response = await Auth0Service.makeAuth0CallAsync(ctx, url, 'GET', token);

    if (response.status !== 200) throw new Error(await response.text());

    return (await response.json<any>()).total;
  }

  private static usersPrefix(query: string): string {
    return `users?sort=last_login:-1&search_engine=v3&q=${query}`;
  }

  private static buildQueryForIds(ids: string[]): string {
    const params: string[] = [];

    for (const id of ids) params.push(`user_id%3D${id.replace('|', '%7C')}`);

    return params.join('%20OR%20');
  }

  private static buildQueryForEmails(emails: string[]): string {
    const params: string[] = [];

    for (const email of emails) params.push(`email%3D${email.replace('@', '%40')}`);

    return params.join('%20OR%20');
  }
}
