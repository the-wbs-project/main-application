import { Project, ProjectLite } from '../../models';
import { DbService } from '../database-services';

export class ProjectDataService {
  constructor(private readonly db: DbService) {}

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
    const p = await this.getFromDbAsync(ownerId, projectId, true);

    if (p == null) return null;

    if (deleteNodes) delete p.nodes;

    return p;
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

  private getFromDbAsync(
    ownerId: string,
    projectId: string,
    clean = true,
  ): Promise<Project | null> {
    return this.db.getDocumentAsync<Project>(ownerId, projectId, clean);
  }
}
