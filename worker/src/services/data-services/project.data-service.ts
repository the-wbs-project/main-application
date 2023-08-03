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

  getAllAssignedAsync(ownerId: string, userId: string): Promise<Project[]> {
    return this.db.getListByQueryAsync<Project>(
      `SELECT * FROM c WHERE c.owner = @owner AND EXISTS (SELECT VALUE z FROM z in c.roles WHERE z.userId = @userId)`,
      true,
      [
        { name: '@owner', value: ownerId },
        { name: '@userId', value: userId },
      ],
      undefined,
      undefined,
      true,
    );
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

    await this.db.upsertDocument(project, project.id);
  }
}
