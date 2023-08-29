import { Context } from '../../config';
import { Project, ProjectCategory } from '../../models';
import { OriginService } from '../origin.service';
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
    project.lastModified = new Date();

    await this.db.upsertDocument(project, project.owner);
  }

  async migrateAsync(): Promise<void> {
    const projects = await this.db.getAllByPartitionAsync<ProjectLegacy>('acme_engineering', true);
    const origin = new OriginService(this.ctx);

    console.log(projects?.length);

    for (const project of projects ?? []) {
      project.disciplines = project.categories?.discipline ?? [];
      project.phases = project.categories?.phase ?? [];

      delete project.categories;

      project.lastModified = new Date(project.lastModified);
      project.createdOn = new Date(project.createdOn ?? project.lastModified);
      project.description = project.description ?? '';

      const res = await origin.putAsync(`projects`, project);

      console.log(res.status + ' ' + (await res.text()));
    }
  }
}

declare interface ProjectLegacy extends Project {
  categories?: {
    discipline: ProjectCategory[];
    phase: ProjectCategory[];
  };
}
