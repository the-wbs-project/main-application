import { Context } from '../../config';
import { Organization, User } from '../../models';
import { AuthDataService } from './auth.data-service';

export class UserDataService extends AuthDataService {
  constructor(ctx: Context) {
    super(ctx);
  }

  async getMembershipsAsync(user: string): Promise<Organization[]> {
    const parts = ['users', user, 'memberships'];
    let organizations = await this.getStateAsync<Organization[]>(parts);

    if (organizations) return organizations;

    const url = `users/${user}/memberships`;
    const response = await this.fetch(url, 'GET');

    if (response.status !== 200) throw new Error(await response.text());

    organizations = await response.json();

    this.putStateAsync(parts, organizations, 60 * 2);

    return organizations ?? [];
  }

  async getRolesAsync(user: string): Promise<string[]> {
    const parts = ['users', user, 'roles'];
    let roles = await this.getStateAsync<string[]>(parts);

    if (roles) return roles;

    const url = `users/${user}/roles`;
    const response = await this.fetch(url, 'GET');

    if (response.status !== 200) throw new Error(await response.text());

    roles = await response.json();

    this.putStateAsync(parts, roles, 60 * 1);

    return roles ?? [];
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
    //
    //  now delete memberships
    //
    for (const membership of await this.getMembershipsAsync(user.id)) {
      await this.deleteStateAsync(['orgs', membership.id, 'members']);
    }
  }
}
