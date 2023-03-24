import { Discussion } from '../../models';
import { DbService } from '../database-services';

export class DiscussionDataService {
  constructor(private readonly db: DbService) {}

  getAllAsync(associationId: string, threadId: string | undefined): Promise<Discussion[]> {
    if (!threadId) return this.db.getAllByPartitionAsync<Discussion>(associationId, true);

    return this.db.getListByQueryAsync<Discussion>(
      `SELECT * FROM c WHERE c.associationId = @associationId AND c.threadId = @threadId`,
      true,
      [
        { name: '@associationId', value: associationId },
        { name: '@threadId', value: threadId },
      ],
    );
  }

  async putAsync(model: Discussion): Promise<any> {
    await this.db.upsertDocument(model, model.associationId);
  }
}
