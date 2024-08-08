import { AuthEntrypoint, UsersEntrypoint } from '../../config';
import { Organization, Role, User, UserBasic } from '../../models';
import { UserViewModel } from '../../view-models';

export class UserDataService {
  constructor(private readonly authApi: AuthEntrypoint) {}

  async getViewAsync(organizationId: string, userId: string, visibility: string): Promise<UserViewModel | undefined> {
    return (await this.service()).getView(organizationId, userId, visibility);
  }

  async getBasicAsync(userId: string): Promise<UserBasic | undefined> {
    return (await this.service()).getBasic(userId);
  }

  async getProfileAsync(userId: string): Promise<User | undefined> {
    return (await this.service()).getProfile(userId);
  }

  async getSiteRolesAsync(userId: string): Promise<Role[]> {
    return (await this.service()).getSiteRoles(userId);
  }

  async getMembershipsAsync(userId: string): Promise<Organization[]> {
    return (await this.service()).getMemberships(userId);
  }

  async updateAsync(user: User): Promise<void> {
    return (await this.service()).update(user);
  }

  private async service(): Promise<UsersEntrypoint> {
    return this.authApi.users();
  }
}
