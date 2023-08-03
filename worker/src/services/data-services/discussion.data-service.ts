import { Context } from '../../config';
import { Discussion } from '../../models';
import { CosmosDbService } from './cosmos-db.service';

export class DiscussionDataService {
  private readonly db: CosmosDbService;

  constructor(ctx: Context) {
    this.db = new CosmosDbService(ctx, 'Discussions', 'associationId');
  }

  getAsync(associationId: string, threadId: string): Promise<Discussion | undefined> {
    return this.db.getDocumentAsync<Discussion>(associationId, threadId, true);
  }

  getAllAsync(associationId: string, threadId: string | undefined): Promise<Discussion[] | undefined> {
    if (!threadId) return this.db.getAllByPartitionAsync<Discussion>(associationId, true);

    return this.db.getListByQueryAsync<Discussion>(
      `SELECT * FROM c WHERE c.associationId = @associationId AND c.threadId = @threadId`,
      true,
      [
        { name: '@associationId', value: associationId },
        { name: '@threadId', value: threadId },
      ],
      undefined,
      undefined,
      true,
    );
  }

  async getAllUsersAsync(associationId: string): Promise<string[]> {
    const allIds = await this.db.getListByQueryAsync<string>(
      `SELECT VALUE c.writtenBy FROM c WHERE c.associationId = @associationId`,
      false,
      [{ name: '@associationId', value: associationId }],
      undefined,
      undefined,
      true,
    );
    const ids: string[] = [];

    for (const id of allIds) if (ids.indexOf(id) === -1) ids.push(id);

    return ids;
  }

  putAsync(model: Discussion): Promise<any> {
    return this.db.upsertDocument(model, model.associationId);
  }
}
