import { Discussion } from '../../models';
import { DbService } from '../database-services';

export class DiscussionDataService {
  constructor(private readonly db: DbService) {}

  getAllAsync(associationId: string): Promise<Discussion[]> {
    return this.db.getAllByPartitionAsync<Discussion>(associationId, true);
  }

  async putAsync(model: Discussion): Promise<any> {
    await this.db.upsertDocument(model, model.associationId);
  }
}
