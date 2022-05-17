import { DbFactory } from '../database-services';
import { EdgeService } from '../edge-services';
import { ProjectDataService } from './project.data-service';
import { MetadataDataService } from './metadata.data-service';
import { ProjectNodeDataService } from './project-node.data-service';
import { ActivityDataService } from './activity.data-service';

export class DataServiceFactory {
  private _activities?: ActivityDataService;
  private _metadata = new MetadataDataService(this.dbFactory, this.edge.data);
  private _projects?: ProjectDataService;
  private _projectNodes?: ProjectNodeDataService;

  constructor(
    private readonly dbFactory: DbFactory,
    private readonly edge: EdgeService,
  ) {}

  setOrganization(organization: string): void {
    this._activities = new ActivityDataService(organization, this.dbFactory);
    this._projects = new ProjectDataService(
      organization,
      this.dbFactory,
      this.edge.data,
    );
    this._projectNodes = new ProjectNodeDataService(
      organization,
      this.dbFactory,
      this.edge.data,
    );
  }

  get activities(): ActivityDataService {
    if (!this._activities) throw new Error('Organization Not Set');
    return this._activities;
  }

  get metadata(): MetadataDataService {
    return this._metadata;
  }

  get projectNodes(): ProjectNodeDataService {
    if (!this._projectNodes) throw new Error('Organization Not Set');
    return this._projectNodes;
  }

  get projects(): ProjectDataService {
    if (!this._projects) throw new Error('Organization Not Set');
    return this._projects;
  }
}
