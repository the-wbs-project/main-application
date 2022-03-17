import { DbFactory } from '../database-services';
import { EdgeService } from '../edge-services';
import { ProjectDataService } from './project.data-service';

export class DataServiceFactory {
  private _project: ProjectDataService | undefined;

  constructor(
    private readonly dbFactory: DbFactory,
    private readonly edge: EdgeService,
  ) {}

  get projects(): ProjectDataService {
    if (this._project == null)
      this._project = new ProjectDataService(this.dbFactory.projects);

    return this._project;
  }
}
