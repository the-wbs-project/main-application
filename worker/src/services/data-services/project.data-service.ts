import { Project } from '../../models';
import { DbService } from '../database-services';
import { EdgeDataService } from '../edge-services';
import { DataServiceHelper } from './helper.data-service';

const kvPrefix = 'PROJECTS';

export class ProjectDataService {
  constructor(private readonly organization: string, private readonly db: DbService, private readonly edge: EdgeDataService) {}

  getAllAsync(): Promise<Project[]> {
    return this.db.getAllAsync<Project>(true);
  }

  getAllWatchedAsync(userId: string): Promise<Project[]> {
    return this.db.getListByQueryAsync<Project>(
      `SELECT * FROM c WHERE ARRAY_CONTAINS(c.watchers, @userId)`,
      true,
      [{ name: '@userId', value: userId }],
      undefined,
      undefined,
      true,
    );
  }

  async getAsync(projectId: string): Promise<Project | undefined> {
    if (this.edge.byPass(kvPrefix)) return await this.getFromDbAsync(projectId);

    const kvName = [kvPrefix, this.organization, projectId].join('|');
    const kvData = await this.edge.get<Project>(kvName, 'json');

    if (kvData) return kvData;

    const data = await this.getFromDbAsync(projectId);

    if (data) this.edge.putLater(kvName, JSON.stringify(data));

    return data;
  }

  async updateModifiedDateAsync(projectId: string): Promise<void> {
    const project = await this.getAsync(projectId);

    if (project) await this.putAsync(project);
  }

  async putAsync(project: Project): Promise<void> {
    const kvName = [kvPrefix, this.organization, project.id].join('|');

    await this.db.upsertDocument(project, project.id);

    this.edge.delete(kvName);
  }

  private getFromDbAsync(projectId: string, clean = true): Promise<Project | undefined> {
    return this.db.getDocumentAsync<Project>(projectId, projectId, clean);
  }
}
