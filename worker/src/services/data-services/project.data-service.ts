import { Document } from '@cfworker/cosmos';
import { DbService } from '../database-services';

export class ProjectDataService {
  constructor(private readonly db: DbService) {}

  getAsync(ownerId: string, projectId: string): Promise<Document | null> {
    return this.db.getDocumentAsync<Document>(ownerId, projectId, true);
  }
}
