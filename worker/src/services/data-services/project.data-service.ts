import { Project } from '../../models';
import { DbFactory, DbService } from '../database-services';
import { EdgeDataService } from '../edge-services';

const kvPrefix = 'PROJECTS';

export class ProjectDataService {
  private readonly db: DbService;

  constructor(
    private readonly organization: string,
    dbFactory: DbFactory,
    private readonly edge: EdgeDataService,
  ) {
    this.db = dbFactory.createDbService(this.organization, 'Projects', 'id');
  }

  getAllAsync(): Promise<Project[]> {
    return this.db.getAllAsync<Project>(true);
  }

  getAllWatchedAsync(userId: string): Promise<Project[]> {
    return this.db.getListByQueryAsync<Project>(
      `SELECT * FROM c WHERE ARRAY_CONTAINS(c.watchers, @userId)`,
      true,
      [{ name: '@userId', value: userId }],
    );
  }

  async getAsync(projectId: string): Promise<Project | undefined> {
    if (this.edge.byPass(kvPrefix)) return await this.getFromDbAsync(projectId);

    const kvName = [kvPrefix, this.organization, projectId].join('-');
    const kvData = await this.edge.get<Project>(kvName, 'json');

    if (kvData) return kvData;

    const data = await this.getFromDbAsync(projectId);

    if (data) this.edge.putLater(kvName, JSON.stringify(data));

    return data;
  }

  async putAsync(project: Project): Promise<void> {
    const kvName = [kvPrefix, this.organization, project.id].join('-');

    await this.db.upsertDocument(project, project.id);

    this.edge.putLater(kvName, JSON.stringify(project));
  }

  private getFromDbAsync(
    projectId: string,
    clean = true,
  ): Promise<Project | undefined> {
    return this.db.getDocumentAsync<Project>(projectId, projectId, clean);
  }
}
