import { DbFactory } from '../database-services';
import { EdgeService } from '../edge-services';
import { StorageFactory } from '../storage-services';
import { ActivityDataService } from './activity.data-service';
import { AuthDataService } from './auth.data-service';
import { DATA_SERVICE_CONFIG } from './data-service.config';
import { InviteDataService } from './invite.data-service';
import { MetadataDataService } from './metadata.data-service';
import { ProjectNodeDataService } from './project-node.data-service';
import { ProjectSnapshotDataService } from './project-snapshot.data-service';
import { ProjectDataService } from './project.data-service';
import { UserActivityDataService } from './user-activity.data-service';

const config = DATA_SERVICE_CONFIG;

export class DataServiceFactory {
  private _activities?: ActivityDataService;
  private _invites?: InviteDataService;
  private _projects?: ProjectDataService;
  private _projectNodes?: ProjectNodeDataService;
  private _projectSnapshots?: ProjectSnapshotDataService;
  private _userActivities?: UserActivityDataService;

  readonly auth = new AuthDataService(this.edge.authData);
  readonly metadata = new MetadataDataService(
    this.dbFactory.createDbService(this.mainRequest, config.resources),
    this.dbFactory.createDbService(this.mainRequest, config.lists),
    this.edge.data,
  );

  constructor(
    private readonly dbFactory: DbFactory,
    private readonly edge: EdgeService,
    private readonly mainRequest: Request,
    private readonly storage: StorageFactory,
  ) {}

  setOrganization(organization: string): void {
    this._activities = new ActivityDataService(
      this.dbFactory.createDbService(this.mainRequest, {
        ...config.activities,
        dbId: organization,
      }),
    );
    this._invites = new InviteDataService(
      this.dbFactory.createDbService(this.mainRequest, {
        ...config.invites,
        dbId: organization,
      }),
    );
    this._projects = new ProjectDataService(
      organization,
      this.dbFactory.createDbService(this.mainRequest, {
        ...config.projects,
        dbId: organization,
      }),
      this.edge.data,
    );
    this._projectNodes = new ProjectNodeDataService(
      this.dbFactory.createDbService(this.mainRequest, {
        ...config.projectNodes,
        dbId: organization,
      }),
    );
    this._projectSnapshots = new ProjectSnapshotDataService(
      this.storage.snapshots,
      this.edge,
      this.projects,
      this.projectNodes,
      organization,
    );
    this._userActivities = new UserActivityDataService(
      this.dbFactory.createDbService(this.mainRequest, {
        ...config.userActivities,
        dbId: organization,
      }),
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

  get userActivities(): UserActivityDataService {
    if (!this._userActivities) throw new Error('Organization Not Set');
    return this._userActivities;
  }
}
