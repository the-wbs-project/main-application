import { Project } from '../../models';
import { DbService } from '../database-services';
import { EdgeDataService } from '../edge-services';

const kvPrefix = 'PROJECTS';

export class ProjectDataService {
  constructor(
    private readonly db: DbService,
    private readonly edge: EdgeDataService,
  ) {}

  getAllAsync(ownerId: string): Promise<Project[]> {
    return this.db.getAllByPartitionAsync<Project>(ownerId, true);
  }

  async getAsync(ownerId: string, projectId: string): Promise<Project | null> {
    if (this.edge.byPass(kvPrefix))
      return await this.getFromDbAsync(ownerId, projectId);

    const kvName = [kvPrefix, ownerId, projectId].join('-');
    const kvData = await this.edge.get<Project>(kvName, 'json');

    if (kvData) return kvData;

    const data = await this.getFromDbAsync(ownerId, projectId);

    if (data) this.edge.putLater(kvName, JSON.stringify(data));

    return data;
  }

  async putAsync(project: Project): Promise<void> {
    const kvName = [kvPrefix, project.owner, project.id].join('-');

    await this.db.upsertDocument(project, project.owner);

    this.edge.putLater(kvName, JSON.stringify(project));
  }

  private getFromDbAsync(
    ownerId: string,
    projectId: string,
    clean = true,
  ): Promise<Project | null> {
    return this.db.getDocumentAsync<Project>(ownerId, projectId, clean);
  }
}
