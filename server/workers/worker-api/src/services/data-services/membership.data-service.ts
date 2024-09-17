import { AuthEntrypoint, MembershipsEntrypoint } from '../../config';
import { UserViewModel } from '../../view-models';

export class MembershipDataService {
  constructor(private readonly authApi: AuthEntrypoint) {}

  async getAllAsync(name: string): Promise<UserViewModel[]> {
    return (await this.service()).getAll(name);
  }

  async addAsync(name: string, members: string[]): Promise<void> {
    return (await this.service()).add(name, members);
  }

  async deleteAsync(name: string, members: string[]): Promise<void> {
    return (await this.service()).delete(name, members);
  }

  async addToRolesAsync(name: string, userId: string, roles: string[]): Promise<void> {
    return (await this.service()).addToRoles(name, userId, roles);
  }

  async deleteFromRolesAsync(name: string, userId: string, roles: string[]): Promise<void> {
    return (await this.service()).deleteFromRoles(name, userId, roles);
  }

  private async service(): Promise<MembershipsEntrypoint> {
    return this.authApi.memberships();
  }
}
