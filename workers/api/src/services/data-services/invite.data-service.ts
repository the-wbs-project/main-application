import { Invite } from '../../models';
import { DbService } from '../database-services';

export class InviteDataService {
  constructor(private readonly db: DbService) {}

  getAllAsync(): Promise<Invite[]> {
    return this.db.getAllByPartitionAsync<Invite>('Invites', true);
  }

  getAsync(inviteCode: string): Promise<Invite | undefined> {
    return this.db.getDocumentAsync<Invite>('Invites', inviteCode, true);
  }

  async putAsync(invite: Invite): Promise<boolean> {
    invite.type = 'Invites';
    return (await this.db.upsertDocument(invite, invite.type)) != null;
  }
}
