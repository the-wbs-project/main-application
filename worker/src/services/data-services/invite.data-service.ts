import { Context } from '../../config';
import { Invite } from '../../models';
import { CosmosDbService } from './cosmos-db.service';

export class InviteDataService {
  private _db?: CosmosDbService;

  constructor(private readonly ctx: Context) {}

  getAllAsync(): Promise<Invite[] | undefined> {
    return this.db.getAllByPartitionAsync<Invite>('Invites', true);
  }

  getAsync(inviteCode: string): Promise<Invite | undefined> {
    return this.db.getDocumentAsync<Invite>('Invites', inviteCode, true);
  }

  async putAsync(invite: Invite): Promise<boolean> {
    invite.type = 'Invites';
    return (await this.db.upsertDocument(invite, invite.type)) != null;
  }

  private get db(): CosmosDbService {
    if (!this._db) {
      const db = this.ctx.get('organization').organization;
      this._db = new CosmosDbService(this.ctx, db, 'Metadata', 'type');
    }
    return this._db;
  }
}
