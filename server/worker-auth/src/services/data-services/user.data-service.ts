import { Organization, Role, User, UserSearchDocument, UserViewModel } from '../../models';
import { Auth0Service, UserSearchDataService } from '../api-services';
import { UserTransformer } from '../transformers';
import { BaseDataService } from './base.data-service';
import { MembershipDataService } from './membership.data-service';
import { OrganizationDataService } from './organization.data-service';

export class UserDataService extends BaseDataService {
  constructor(
    private readonly api: Auth0Service,
    private readonly memberships: MembershipDataService,
    private readonly search: UserSearchDataService,
    kv: KVNamespace,
    ctx: ExecutionContext,
  ) {
    super(kv, ctx);
  }

  public async getAsync(organization: string, userId: string, visibility: string): Promise<UserViewModel | null | undefined> {
    const key = this.key('USERS', userId, 'ORGS', organization, visibility);
    const kvData = await this.getKv<UserViewModel>(key);

    if (kvData) return kvData;

    const [profile, roles] = await Promise.all([this.api.users.getAsync(userId), this.api.memberships.getRolesAsync(organization, userId)]);
    
    const vm = UserTransformer.toViewModel()
  }

  public async getProfileAsync(userId: string): Promise<User | undefined> {
    //
    //  This "probably" won't be used, but shouldn't be cached.
    //
    return this.api.users.getAsync(userId);
  }

  public async getSiteRolesAsync(userId: string): Promise<Role[]> {
    const key = this.key('USERS', userId, 'SITE_ROLES');

    return this.getArrayAsync(key, () => this.api.users.getSiteRolesAsync(userId));
  }

  public async getMembershipsAsync(userId: string): Promise<Organization[]> {
    const key = this.key('USERS', userId, 'MEMBERSHIPS');

    return this.getArrayAsync(key, () => this.api.users.getMembershipsAsync(userId));
  }

  public async updateAsync(data: User): Promise<void> {
    await Promise.all([this.api.users.updateAsync(data), this.clearCacheAsync(data.user_id)]);
  }

  public async clearCacheAsync(userId: string): Promise<void> {
    const [orgs, kvKeys] = await Promise.all([this.getMembershipsAsync(userId), this.kv.list({ prefix: this.key('USERS', userId) })]);

    this.deleteKv(this.key('USERS', userId), ...kvKeys.keys.map((x) => x.name), ...orgs.map((x) => this.key('ORGS', x.id, 'MEMBERS')));
  }

  private transform(doc: UserSearchDocument | undefined): UserViewModel | undefined {
    return doc ? UserTransformer.toViewModel(doc) : undefined;
  }
}
