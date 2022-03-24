import { Project } from '../../models';
import { DbService } from '../database-services';

export class ProjectDataService {
  constructor(private readonly db: DbService) {}

  getAsync(
    ownerId: string,
    projectId: string,
    clean = true,
  ): Promise<Project | null> {
    return this.db.getDocumentAsync<Project>(ownerId, projectId, clean);
  }
}
