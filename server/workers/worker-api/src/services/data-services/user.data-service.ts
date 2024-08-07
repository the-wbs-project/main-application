import { UserEntrypoint } from '../../config';
import { Organization, Role, User, UserBasic } from '../../models';
import { UserViewModel } from '../../view-models';

export class UserDataService {
  constructor(private readonly service: UserEntrypoint) {}

  public getViewAsync(organizationId: string, userId: string, visibility: string): Promise<UserViewModel | undefined> {
    return this.service.getView(organizationId, userId, visibility);
  }

  getBasicAsync(userId: string): Promise<UserBasic | undefined> {
    return this.service.getBasic(userId);
  }

  getProfileAsync(userId: string): Promise<User | undefined> {
    return this.service.getProfile(userId);
  }

  getSiteRolesAsync(userId: string): Promise<Role[]> {
    return this.service.getSiteRoles(userId);
  }

  getMembershipsAsync(userId: string): Promise<Organization[]> {
    return this.service.getMemberships(userId);
  }

  updateAsync(user: User): Promise<void> {
    return this.service.update(user);
  }
}
