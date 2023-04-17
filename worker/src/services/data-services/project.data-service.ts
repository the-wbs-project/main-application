import { Context } from '../../config';
import { Project } from '../../models';
import { CosmosDbService } from './cosmos-db.service';

export class ProjectDataService {
  private readonly prefix = 'PROJECTS';
  private readonly byPass = (this.ctx.env.KV_BYPASS ?? '').split(',').indexOf(this.prefix) > -1;
  private _db?: CosmosDbService;

  constructor(private readonly ctx: Context) {}

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
    if (this.byPass) return await this.getFromDbAsync(projectId);

    const kvName = [this.prefix, this.organization, projectId].join('|');
    const kvData = await this.ctx.env.KV_DATA.get<Project>(kvName, 'json');

    if (kvData) return kvData;

    const data = await this.getFromDbAsync(projectId);

    if (data) this.ctx.executionCtx.waitUntil(this.ctx.env.KV_DATA.put(kvName, JSON.stringify(data)));

    return data;
  }

  async updateModifiedDateAsync(projectId: string): Promise<void> {
    const project = await this.getAsync(projectId);

    if (project) await this.putAsync(project);
  }

  async putAsync(project: Project): Promise<void> {
    const kvName = [this.prefix, this.organization, project.id].join('|');

    project.lastModified = Date.now();

    await this.db.upsertDocument(project, project.id);
    await this.ctx.env.KV_DATA.delete(kvName);
  }

  private getFromDbAsync(projectId: string, clean = true): Promise<Project | undefined> {
    return this.db.getDocumentAsync<Project>(projectId, projectId, clean);
  }

  private get organization(): string {
    return this.ctx.get('organization').organization;
  }

  private get db(): CosmosDbService {
    if (!this._db) {
      const db = this.organization;
      this._db = new CosmosDbService(this.ctx, db, 'Projects', 'id');
    }
    return this._db;
  }
}
