import { PROJECT_VIEW, User } from '../../models';
import { MetadataDataService } from './metadata.data-service';
import { ProjectDataService } from './project.data-service';

export class InitialDataService {
  constructor(
    private readonly metadata: MetadataDataService,
    private readonly project: ProjectDataService,
  ) {}

  async getHydrateDataAsync(user: User | undefined): Promise<unknown> {
    const [phase, discipline, resources, project] = await Promise.all([
      this.metadata.getCategoriesAsync(PROJECT_VIEW.PHASE),
      this.metadata.getCategoriesAsync(PROJECT_VIEW.DISCIPLINE),
      this.metadata.getResourcesAsync(user?.userInfo?.culture ?? '', 'General'),
      this.project.getAsync('acme_engineering', '123'),
    ]);
    return {
      categoriesDiscipline: discipline,
      categoriesPhase: phase,
      projects: [project],
      resources: resources,
      user,
    };
  }
}
