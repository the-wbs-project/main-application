import { Organization, Role, User, UserBasic, UserViewModel } from '../../models';
import { Auth0Service } from '../api-services';
import { Logger } from '../logging';
import { UserTransformer } from '../transformers';
import { BaseDataService } from './base.data-service';

export class UserDataService extends BaseDataService {
  constructor(private readonly api: Auth0Service, private readonly logger: Logger, kv: KVNamespace, ctx: ExecutionContext) {
    super(kv, ctx);
  }

  public async getBasicAsync(userId: string): Promise<UserBasic | undefined> {
    const key = this.key('USERS', userId, 'BASIC');
    const kvData = await this.getKv<UserBasic>(key);

    if (kvData) return kvData;

    const profile = await this.api.users.getAsync(userId);

    if (!profile) return undefined;

    const basic: UserBasic = {
      user_id: profile.user_id,
      email: profile.email,
      name: profile.name,
      picture: profile.picture,
    };

    this.putKv(key, basic);

    return basic;
  }

  public async getAsync(
    organization: string,
    userId: string,
    visibility: 'organization' | 'public',
  ): Promise<UserViewModel | null | undefined> {
    const key = this.key('USERS', userId, 'ORGS', organization, 'VIS', visibility);
    const kvData = await this.getKv<UserViewModel>(key);

    if (kvData) return kvData;

    const [profile, roles] = await Promise.all([this.api.users.getAsync(userId), this.api.memberships.getRolesAsync(organization, userId)]);

    if (!profile) return null;

    const vm = UserTransformer.toViewModel(profile, visibility, roles);

    this.putKv(key, vm);

    return vm;
  }

  public async getProfileAsync(userId: string): Promise<User | undefined> {
    //
    //  This "probably" won't be used, but shouldn't be cached.
    //
    const profile = await this.api.users.getAsync(userId);

    if (!profile) return undefined;

    if (!profile.user_metadata) profile.user_metadata = {};
    if (!profile.user_metadata.showExternally) profile.user_metadata.showExternally = [];

    return profile;
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
    const orgs = await this.getMembershipsAsync(userId);
    const orgKeys = orgs.map((x) => this.key('ORGS', x.id, 'MEMBERS'));
    const userKeys = await this.kv.list({ prefix: this.key('USERS', userId) });

    this.logger.trackEvent('deleting the following keys', 'Warn', { keys: [...orgKeys, ...userKeys.keys.map((x) => x.name)] });

    await this.deleteKvAsync(...orgKeys, ...userKeys.keys.map((x) => x.name));
  }
}
