import { User, UserLite } from '../../models';
import { WorkerRequest } from '../worker-request.service';
import { Auth0Service } from './auth0.service';

export class IdentityService {
  constructor(private readonly auth0: Auth0Service) {}

  async updateProfileAsync(req: WorkerRequest, user: User): Promise<void> {
    const token = await this.auth0.getMgmtTokenAsync(req);
    const response = await this.auth0.makeAuth0CallAsync(req, `users/${user.id}`, 'PATCH', token, {
      name: user.name,
      user_metadata: user.userInfo,
    });
    if (response.status !== 200) {
      const message = await response.text();

      throw new Error(`${response.status}: ${message}`);
    }
  }

  async updateUserAsync(req: WorkerRequest, user: User): Promise<void> {
    const token = await this.auth0.getMgmtTokenAsync(req);
    const response = await this.auth0.makeAuth0CallAsync(req, `users/${user.id}`, 'PATCH', token, {
      blocked: user.blocked,
      app_metadata: user.appInfo,
    });
    if (response.status !== 200) {
      const message = await response.text();

      throw new Error(`${response.status}: ${message}`);
    }
  }

  async getUserAsync(req: WorkerRequest, userId: string): Promise<User> {
    //const kvName = `USERS|${userId}`;
    //let user = await this.config.kvAuth.get<User>(kvName, 'json');

    //if (user) return user;

    const url = `users/${userId}`;
    const token = await this.auth0.getMgmtTokenAsync(req);
    const response = await this.auth0.makeAuth0CallAsync(req, url, 'GET', token);

    if (response.status !== 200) throw new Error(await response.text());

    const user = this.auth0.toUser(await response.json());

    //await this.config.kvAuth.put(kvName, JSON.stringify(user), {
    //  expirationTtl: 24 * 60 * 60,
    //});

    return user;
  }

  async getUsersAsync(req: WorkerRequest): Promise<User[]> {
    const token = await this.auth0.getMgmtTokenAsync(req);
    const count = await this.getUserCountAsync(req, token);
    const list: User[] = [];
    let page = 0;
    const size = 50;

    while (list.length < count) {
      list.push(...(await this.getUserPageAsync(req, token, page, size)));
      page++;
    }
    return list;
  }

  async getLiteUsersAsync(req: WorkerRequest): Promise<UserLite[]> {
    const token = await this.auth0.getMgmtTokenAsync(req);
    const count = await this.getUserCountAsync(req, token);
    const list: UserLite[] = [];
    let page = 0;
    const size = 50;

    while (list.length < count) {
      list.push(...(await this.getLiteUserPageAsync(req, token, page, size)));
      page++;
    }
    return list;
  }

  private async getUserPageAsync(req: WorkerRequest, token: string, pageNumber: number, pageSize: number): Promise<User[]> {
    const org = req.context.organization!.organization;

    const url = `${this.usersPrefix(org)}&page=${pageNumber}&per_page=${pageSize}`;
    const response = await this.auth0.makeAuth0CallAsync(req, url, 'GET', token);
    const results: User[] = [];

    if (response.status !== 200) throw new Error(await response.text());

    for (const user of await response.json<any>()) {
      results.push(this.auth0.toUser(user));
    }
    return results;
  }

  private async getLiteUserPageAsync(req: WorkerRequest, token: string, pageNumber: number, pageSize: number): Promise<UserLite[]> {
    const org = req.context.organization!.organization;

    const url = `${this.usersPrefix(org)}&fields=email,name,user_id&page=${pageNumber}&per_page=${pageSize}`;
    const response = await this.auth0.makeAuth0CallAsync(req, url, 'GET', token);
    const results: UserLite[] = [];

    if (response.status !== 200) throw new Error(await response.text());

    for (const user of await response.json<any>()) {
      results.push(this.auth0.toLiteUser(user));
    }
    return results;
  }

  private async getUserCountAsync(req: WorkerRequest, token: string): Promise<number> {
    const org = req.context.organization!.organization;

    const url = `${this.usersPrefix(org)}&include_totals=true`;
    const response = await this.auth0.makeAuth0CallAsync(req, url, 'GET', token);

    if (response.status !== 200) throw new Error(await response.text());

    return (await response.json<any>()).total;
  }

  private usersPrefix(org: string): string {
    return `users?sort=last_login:-1&search_engine=v3&q=_exists_:app_metadata.organizations.${org}`;
  }
}
