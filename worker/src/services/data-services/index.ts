import { DbFactory } from '../database-services';
import { EdgeService } from '../edge-services';
import { StorageFactory } from '../storage-services';
import { ActivityDataService } from './activity.data-service';
import { AuthDataService } from './auth.data-service';
import { InviteDataService } from './invite.data-service';
import { MetadataDataService } from './metadata.data-service';
import { ProjectNodeDataService } from './project-node.data-service';
import { ProjectSnapshotDataService } from './project-snapshot.data-service';
import { ProjectDataService } from './project.data-service';

export class DataServiceFactory {
  private _activities?: ActivityDataService;
  private _invites?: InviteDataService;
  private _projects?: ProjectDataService;
  private _projectNodes?: ProjectNodeDataService;
  private _projectSnapshots?: ProjectSnapshotDataService;

  readonly auth = new AuthDataService(this.edge.authData);
  readonly metadata = new MetadataDataService(this.mainRequest, this.dbFactory, this.edge.data);

  constructor(
    private readonly dbFactory: DbFactory,
    private readonly edge: EdgeService,
    private readonly mainRequest: Request,
    private readonly storage: StorageFactory,
  ) {}

  setOrganization(organization: string): void {
    this._activities = new ActivityDataService(organization, this.mainRequest, this.dbFactory);
    this._invites = new InviteDataService(organization, this.mainRequest, this.dbFactory);
    this._projects = new ProjectDataService(organization, this.dbFactory, this.mainRequest, this.edge.data);
    this._projectNodes = new ProjectNodeDataService(organization, this.dbFactory, this.mainRequest, this.edge.data);
    this._projectSnapshots = new ProjectSnapshotDataService(
      this.storage.snapshots,
      this.edge,
      this.projects,
      this.projectNodes,
      organization,
    );
  }

  get activities(): ActivityDataService {
    if (!this._activities) throw new Error('Organization Not Set');
    return this._activities;
  }

  get invites(): InviteDataService {
    if (!this._invites) throw new Error('Organization Not Set');
    return this._invites;
  }

  get projectNodes(): ProjectNodeDataService {
    if (!this._projectNodes) throw new Error('Organization Not Set');
    return this._projectNodes;
  }

  get projects(): ProjectDataService {
    if (!this._projects) throw new Error('Organization Not Set');
    return this._projects;
  }

  get projectSnapshots(): ProjectSnapshotDataService {
    if (!this._projectSnapshots) throw new Error('Organization Not Set');
    return this._projectSnapshots;
  }
}
