import { DbFactory } from '../database-services';
import { EdgeService } from '../edge-services';
import { InitialDataService } from './initial.data-service';
import { ProjectDataService } from './project.data-service';
import { MetadataDataService } from './metadata.data-service';

export class DataServiceFactory {
  private _initial: InitialDataService | undefined;
  private _metadata: MetadataDataService | undefined;
  private _project: ProjectDataService | undefined;

  constructor(
    private readonly dbFactory: DbFactory,
    private readonly edge: EdgeService,
  ) {}

  get initial(): InitialDataService {
    if (this._initial == null)
      this._initial = new InitialDataService(this.metadata, this.projects);
    return this._initial;
  }

  get metadata(): MetadataDataService {
    if (this._metadata == null)
      this._metadata = new MetadataDataService(
        this.dbFactory.metadata,
        this.edge.data,
      );

    return this._metadata;
  }

  get projects(): ProjectDataService {
    if (this._project == null)
      this._project = new ProjectDataService(this.dbFactory.projects);

    return this._project;
  }
}
