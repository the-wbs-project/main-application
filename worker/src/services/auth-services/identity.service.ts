import { AuthConfig } from '../../config';
import { User } from '../../models';
import { Auth0Service } from '../auth-services';
import { WorkerRequest } from '../worker-request.service';

export class IdentityService {
  constructor(
    private readonly auth0: Auth0Service,
    private readonly config: AuthConfig,
  ) {}

  async updateProfileAsync(req: WorkerRequest, user: User): Promise<void> {
    const response = await this.auth0.makeAuth0CallAsync(
      req,
      `users/${user.id}`,
      'PATCH',
      {
        name: user.name,
        user_metadata: user.userInfo,
      },
    );
    if (response.status !== 200) {
      const message = await response.text();

      throw new Error(`${response.status}: ${message}`);
    }
  }

  async updateUserAsync(req: WorkerRequest, user: User): Promise<void> {
    const response = await this.auth0.makeAuth0CallAsync(
      req,
      `users/${user.id}`,
      'PATCH',
      {
        blocked: user.blocked,
        app_metadata: user.appInfo,
      },
    );
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

  private async getUserPageAsync(
    req: WorkerRequest,
    pageNumber: number,
    pageSize: number,
  ): Promise<User[]> {
    const conn = this.config.connection;
    const q = this.getQuery(req);
    const url = `users?page=${pageNumber}&per_page=${pageSize}&sort=last_login:-1&connection=${conn}&search_engine=v3&q=${q}`;
    const response = await this.auth0.makeAuth0CallAsync(req, url, 'GET');
    const results: User[] = [];

    if (response.status !== 200) throw new Error(await response.text());

    for (const user of await response.json()) {
      console.log(user);
      results.push(this.auth0.toUser(user));
    }
    return results;
  }

  private async getUserCountAsync(req: WorkerRequest): Promise<number> {
    const conn = this.config.connection;
    const q = this.getQuery(req);
    const url = `users?include_totals=true&connection=${conn}&search_engine=v3&q=${q}`;
    const response = await this.auth0.makeAuth0CallAsync(req, url, 'GET');

    if (response.status !== 200) throw new Error(await response.text());

    return (await response.json()).total;
  }

  private getQuery(req: WorkerRequest): string {
    return `app_metadata.claims%3A${req.organization}%5C%3Auser`;
  }
}
