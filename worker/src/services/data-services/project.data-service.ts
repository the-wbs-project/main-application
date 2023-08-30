import { Context } from '../../config';
import { Project, ProjectCategory } from '../../models';
import { OriginService } from '../origin.service';
import { CosmosDbService } from './cosmos-db.service';

export class ProjectDataService {
  private readonly db: CosmosDbService;

  constructor(private readonly ctx: Context) {
    this.db = new CosmosDbService(this.ctx, 'Projects', 'id');
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
