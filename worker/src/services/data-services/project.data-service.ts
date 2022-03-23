import { Document } from '@cfworker/cosmos';
import { Project } from '../../models';
import { DbService } from '../database-services';

export class ProjectDataService {
  constructor(private readonly db: DbService) {}

  async getAsync(ownerId: string, projectId: string): Promise<Document | null> {
    const project = await this.db.getDocumentAsync<Project>(
      'acme_engineering',
      '123',
      true,
    );
    if (project) {
      project.lastModified = new Date();
      await this.db.upsertDocument(project, project.owner);
    }
    return this.db.getDocumentAsync<Document>(ownerId, projectId, true);
  }
}
