import { Context } from '../../config';
import { Project } from '../../models';
import { CosmosDbService } from './cosmos-db.service';

export class ProjectDataService {
  private readonly db: CosmosDbService;

  constructor(private readonly ctx: Context) {
    this.db = new CosmosDbService(this.ctx, 'Projects', 'id');
  }

  getAllAsync(ownerId: string): Promise<Project[] | undefined> {
    return this.db.getAllByPartitionAsync<Project>(ownerId, true);
  }

  getAsync(ownerId: string, projectId: string): Promise<Project | undefined> {
    return this.db.getDocumentAsync<Project>(ownerId, projectId, true);
  }

  async updateModifiedDateAsync(ownerId: string, projectId: string): Promise<void> {
    const project = await this.getAsync(ownerId, projectId);

    if (project) await this.putAsync(project);
  }

  async putAsync(project: Project): Promise<void> {
    project.lastModified = Date.now();

    await this.db.upsertDocument(project, project.owner);
  }
}
