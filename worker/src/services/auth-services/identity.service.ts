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
      app_metadata: user.appInfo,
    });
    if (response.status !== 200) {
      const message = await response.text();

      throw new Error(`${response.status}: ${message}`);
    }
  }

  static async getUserAsync(ctx: Context, userId: string): Promise<User> {
    //const kvName = `USERS|${userId}`;
    //let user = await this.config.kvAuth.get<User>(kvName, 'json');

    //if (user) return user;

    const url = `users/${userId}`;
    const token = await Auth0Service.getMgmtTokenAsync(ctx);
    const response = await Auth0Service.makeAuth0CallAsync(ctx, url, 'GET', token);

    if (response.status !== 200) throw new Error(await response.text());

    const user = Auth0Service.toUser(await response.json());

    //await this.config.kvAuth.put(kvName, JSON.stringify(user), {
    //  expirationTtl: 24 * 60 * 60,
    //});

    return user;
  }

  static async getUsersAsync(ctx: Context): Promise<User[]> {
    const token = await Auth0Service.getMgmtTokenAsync(ctx);
    const count = await this.getUserCountAsync(ctx, token);
    const list: User[] = [];
    let page = 0;
    const size = 50;

    while (list.length < count) {
      list.push(...(await this.getUserPageAsync(ctx, token, page, size)));
      page++;
    }
    return list;
  }

  static async getLiteUsersAsync(ctx: Context): Promise<UserLite[]> {
    const token = await Auth0Service.getMgmtTokenAsync(ctx);
    const count = await this.getUserCountAsync(ctx, token);
    const list: UserLite[] = [];
    let page = 0;
    const size = 50;

    while (list.length < count) {
      list.push(...(await this.getLiteUserPageAsync(ctx, token, page, size)));
      page++;
    }
    return list;
  }

  private static async getUserPageAsync(ctx: Context, token: string, pageNumber: number, pageSize: number): Promise<User[]> {
    const org = ctx.get('organization').organization;

    const url = `${this.usersPrefix(org)}&page=${pageNumber}&per_page=${pageSize}`;
    const response = await Auth0Service.makeAuth0CallAsync(ctx, url, 'GET', token);
    const results: User[] = [];

    if (response.status !== 200) throw new Error(await response.text());

    for (const user of await response.json<any>()) {
      results.push(Auth0Service.toUser(user));
    }
    return results;
  }

  private static async getLiteUserPageAsync(ctx: Context, token: string, pageNumber: number, pageSize: number): Promise<UserLite[]> {
    const org = ctx.get('organization').organization;

    const url = `${this.usersPrefix(org)}&fields=email,name,user_id&page=${pageNumber}&per_page=${pageSize}`;
    const response = await Auth0Service.makeAuth0CallAsync(ctx, url, 'GET', token);
    const results: UserLite[] = [];

    if (response.status !== 200) throw new Error(await response.text());

    for (const user of await response.json<any>()) {
      results.push(Auth0Service.toLiteUser(user));
    }
    return results;
  }

  private static async getUserCountAsync(ctx: Context, token: string): Promise<number> {
    const org = ctx.get('organization').organization;

    const url = `${this.usersPrefix(org)}&include_totals=true`;
    const response = await Auth0Service.makeAuth0CallAsync(ctx, url, 'GET', token);

    if (response.status !== 200) throw new Error(await response.text());

    return (await response.json<any>()).total;
  }

  private static usersPrefix(org: string): string {
    return `users?sort=last_login:-1&search_engine=v3&q=_exists_:app_metadata.organizations.${org}`;
  }
}
