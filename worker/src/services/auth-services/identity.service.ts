import { User, UserLite } from '../../models';
import { Auth0Service } from '../auth-services';
import { WorkerRequest } from '../worker-request.service';

export class IdentityService {
  constructor(private readonly auth0: Auth0Service) {}

  async updateProfileAsync(req: WorkerRequest, user: User): Promise<void> {
    const response = await this.auth0.makeAuth0CallAsync(req, `users/${user.id}`, 'PATCH', {
      name: user.name,
      user_metadata: user.userInfo,
    });
    if (response.status !== 200) {
      const message = await response.text();

      throw new Error(`${response.status}: ${message}`);
    }
  }

  async updateUserAsync(req: WorkerRequest, user: User): Promise<void> {
    const response = await this.auth0.makeAuth0CallAsync(req, `users/${user.id}`, 'PATCH', {
      blocked: user.blocked,
      app_metadata: user.appInfo,
    });
    if (response.status !== 200) {
      const message = await response.text();

      throw new Error(`${response.status}: ${message}`);
    }
  }

  async getUserAsync(req: WorkerRequest, userId: string): Promise<User | null> {
    const url = `users/${userId}`;
    const response = await this.auth0.makeAuth0CallAsync(req, url, 'GET');

    if (response.status !== 200) throw new Error(await response.text());

    return this.auth0.toUser(await response.json());
  }

  async getUsersAsync(req: WorkerRequest): Promise<User[]> {
    const count = await this.getUserCountAsync(req);
    const list: User[] = [];
    let page = 0;
    const size = 50;

    while (list.length < count) {
      list.push(...(await this.getUserPageAsync(req, page, size)));
      page++;
    }
    return list;
  }

  async getLiteUsersAsync(req: WorkerRequest): Promise<UserLite[]> {
    const count = await this.getUserCountAsync(req);
    const list: UserLite[] = [];
    let page = 0;
    const size = 50;

    while (list.length < count) {
      list.push(...(await this.getLiteUserPageAsync(req, page, size)));
      page++;
    }
    return list;
  }

  private async getUserPageAsync(req: WorkerRequest, pageNumber: number, pageSize: number): Promise<User[]> {
    const org = req.context.organization?.organization;
    const conn = req.context.config.auth.connection;
    const url = `users?q=_exists_:app_metadata.organizations.${org}&page=${pageNumber}&per_page=${pageSize}&sort=last_login:-1&connection=${conn}&search_engine=v3`;
    const response = await this.auth0.makeAuth0CallAsync(req, url, 'GET');
    const results: User[] = [];

    if (response.status !== 200) throw new Error(await response.text());

    for (const user of await response.json<any>()) {
      results.push(this.auth0.toUser(user));
    }
    return results;
  }

  private async getLiteUserPageAsync(req: WorkerRequest, pageNumber: number, pageSize: number): Promise<UserLite[]> {
    const org = req.context.organization?.organization;
    const conn = req.context.config.auth.connection;
    const url = `users?fields=email,name,user_id&q=_exists_:app_metadata.organizations.${org}&page=${pageNumber}&per_page=${pageSize}&sort=last_login:-1&connection=${conn}&search_engine=v3`;
    const response = await this.auth0.makeAuth0CallAsync(req, url, 'GET');
    const results: UserLite[] = [];

    if (response.status !== 200) throw new Error(await response.text());

    for (const user of await response.json<any>()) {
      results.push(this.auth0.toLiteUser(user));
    }
    return results;
  }

  private async getUserCountAsync(req: WorkerRequest): Promise<number> {
    const org = req.context.organization?.organization;
    const conn = req.context.config.auth.connection;
    const url = `users?q=_exists_:app_metadata.organizations.${org}&include_totals=true&connection=${conn}&search_engine=v3`;
    const response = await this.auth0.makeAuth0CallAsync(req, url, 'GET');

    if (response.status !== 200) throw new Error(await response.text());

    return (await response.json<any>()).total;
  }
}
