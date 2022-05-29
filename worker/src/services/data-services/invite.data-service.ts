import { Invite } from '../../models';
import { DbFactory, DbService } from '../database-services';

export class InviteDataService {
  private readonly db: DbService;

  constructor(private readonly organization: string, dbFactory: DbFactory) {
    this.db = dbFactory.createDbService(this.organization, 'Metadata', 'type');
  }

  getAllAsync(): Promise<Invite[]> {
    return this.db.getAllAsync<Invite>(true);
  }

  getAsync(inviteCode: string): Promise<Invite | undefined> {
    return this.db.getDocumentAsync<Invite>('Invites', inviteCode, true);
  }

  putAsync(invite: Invite): Promise<number> {
    return this.db.upsertDocument(invite, 'Invites');
  }
}
