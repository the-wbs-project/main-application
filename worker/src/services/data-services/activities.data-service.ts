import { Project, ProjectLite } from '../../models';
import { DbService } from '../database-services';
import { EdgeDataService } from '../edge-services';

export class ActivitiesDataService {
  constructor(
    private readonly db: DbService,
    private readonly edge: EdgeDataService,
  ) {}

  async getAllAsync(ownerId: string): Promise<Project[]> {
    const list = await this.db.getAllByPartitionAsync<Project>(ownerId, true);

    for (const p of list) delete p.nodes;

    return list;
  }

  async getAsync(
    ownerId: string,
    projectId: string,
    deleteNodes = true,
  ): Promise<Project | null> {
    const data = await this.getObjectAsync(ownerId, projectId);

    if (data == null) return null;

    if (deleteNodes) delete data.nodes;

    return data;
  }

  async getLiteAsync(
    ownerId: string,
    projectId: string,
    clean = true,
  ): Promise<ProjectLite | null> {
    const p = await this.getFromDbAsync(ownerId, projectId, clean);

    if (p == null) return null;

    return <ProjectLite>{
      id: p.id,
      lastModified: p.lastModified,
      owner: p.owner,
      status: p.status,
      title: p.title,
      tags: p.tags,
    };
  }

  async putAsync(project: Project): Promise<void> {
    //const kvName = [kvPrefix, project.owner, project.id].join('-');
    //await this.db.upsertDocument(project, project.owner);
    //this.edge.putLater(kvName, JSON.stringify(project));
  }

  private async getObjectAsync(
    ownerId: string,
    projectId: string,
  ): Promise<Project | null> {
    return null; /*
    if (this.edge.byPass(kvPrefix))
      return await this.getFromDbAsync(ownerId, projectId);

    const kvName = [kvPrefix, ownerId, projectId].join('-');
    const kvData = await this.edge.get<Project>(kvName, 'json');

    if (kvData) return kvData;

    const data = await this.getFromDbAsync(ownerId, projectId);

    if (data) this.edge.putLater(kvName, JSON.stringify(data));

    return data;*/
  }

  private getFromDbAsync(
    ownerId: string,
    projectId: string,
    clean = true,
  ): Promise<Project | null> {
    return this.db.getDocumentAsync<Project>(ownerId, projectId, clean);
  }
}
