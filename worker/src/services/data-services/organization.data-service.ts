import { Context } from '../../config';
import { Member } from '../../models';
import { AuthDataService } from './auth.data-service';

export class OrganizationDataService extends AuthDataService {
  constructor(ctx: Context) {
    super(ctx);
  }

  async getMembersAsync(organization: string): Promise<Member[]> {
    const parts = ['orgs', organization, 'members']
    let members = await this.getStateAsync<Member[]>(parts);

    if (members) return members;

    const url = `organizations/${organization}/members`;
    const response = await this.fetch(url, 'GET');

    if (response.status !== 200) throw new Error(await response.text());

    members = await response.json();

    this.putStateAsync(parts, members, 60 * 2);

    return members ?? [];
  }

  async removeMemberAsync(organization: string, user: string): Promise<void> {
    const url = `organizations/${organization}/members/${user}`;
    const response = await this.fetch(url, 'DELETE');

    if (response.status !== 204) throw new Error(await response.text());

    this.deleteStateAsync(['orgs', organization, 'members']);
    this.deleteStateAsync(['users', user, 'memberships']);
  }

  async addMemberRolesAsync(organization: string, user: string, roles: string[]): Promise<void> {
    const url = `organizations/${organization}/members/${user}/roles`;
    const response = await this.fetch(url, 'POST', JSON.stringify(roles));

    if (response.status !== 204) throw new Error(await response.text());

    this.deleteStateAsync(['orgs', organization, 'members']);
  }

  async removeMemberRolesAsync(organization: string, user: string, roles: string[]): Promise<void> {
    const url = `organizations/${organization}/members/${user}/roles`;
    const response = await this.fetch(url, 'DELETE', JSON.stringify(roles));

    if (response.status !== 204) throw new Error(await response.text());

    this.deleteStateAsync(['orgs', organization, 'members']);
  }
}
