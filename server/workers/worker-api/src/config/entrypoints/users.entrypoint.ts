import { Organization, Role, User, UserBasic } from '../../models';
import { UserViewModel } from '../../view-models';

export interface UsersEntrypoint {
  getBasic(userId: string): Promise<UserBasic | undefined>;
  getView(organizationName: string, userId: string, visibility: string): Promise<UserViewModel>;
  getProfile(userId: string): Promise<User | undefined>;
  getSiteRoles(userId: string): Promise<Role[]>;
  getMemberships(userId: string): Promise<Organization[]>;
  update(user: User): Promise<void>;
}
