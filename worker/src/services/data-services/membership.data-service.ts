import { Context } from '../../config';
import { Membership } from '../../models';
import { CosmosDbService } from './cosmos-db.service';

export class MembershipDataService {
  private readonly db: CosmosDbService;

  constructor(private readonly ctx: Context) {
    this.db = new CosmosDbService(this.ctx, 'Organizations', 'id');
  }

  getAsync(organization: string, user: string): Promise<Membership | undefined> {
    return this.db.getDocumentAsync<Membership>(organization, user, true);
  }

  getAllForOrganizationAsync(organization: string): Promise<Membership[] | undefined> {
    return this.db.getAllByPartitionAsync<Membership>(organization, true);
  }

  getAllForUserAsync(user: string): Promise<Membership[]> {
    return this.db.getListByQueryAsync<Membership>(
      `SELECT * FROM c WHERE c.id = @user`,
      true,
      [{ name: '@user', value: user }],
      undefined,
      undefined,
      true,
    );
  }

  async putAsync(membership: Membership): Promise<void> {
    await this.db.upsertDocument(membership, membership.id);
  }
}
