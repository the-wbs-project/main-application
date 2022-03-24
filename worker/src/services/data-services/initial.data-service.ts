import { METADATA_TYPES, PROJECT_VIEW, User } from '../../models';
import { MetadataDataService } from './metadata.data-service';
import { ProjectDataService } from './project.data-service';

export class InitialDataService {
  constructor(
    private readonly metadata: MetadataDataService,
    private readonly project: ProjectDataService,
  ) {}

  async getHydrateDataAsync(user: User | undefined): Promise<unknown> {
    const [disciplineCats, phaseCats, resources, project] = await Promise.all([
      this.metadata.getAsync(
        METADATA_TYPES.CATEGORIES,
        PROJECT_VIEW.DISCIPLINE,
      ),
      this.metadata.getAsync(METADATA_TYPES.CATEGORIES, PROJECT_VIEW.PHASE),
      this.metadata.getAsync(METADATA_TYPES.RESOURCES, 'en-US'),
      this.project.getAsync('acme_engineering', '123'),
    ]);
    return {
      categoriesDiscipline: disciplineCats,
      categoriesPhase: phaseCats,
      projects: [project],
      resources: resources,
      user,
    };
  }
}
