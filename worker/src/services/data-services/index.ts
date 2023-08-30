import { Context } from '../../config';
import { ActivityDataService } from './activity.data-service';
import { ChecklistDataService } from './checklist.data-service';
import { ListDataService } from './list.data-service';
import { OrganizationDataService } from './organization.data-service';
import { ProjectNodeDataService } from './project-node.data-service';
import { ProjectSnapshotDataService } from './project-snapshot.data-service';
import { ProjectDataService } from './project.data-service';
import { ResourcesDataService } from './resources.data-service';
import { UserDataService } from './user.data-service';

export class DataServiceFactory {
  readonly activities: ActivityDataService;
  readonly checklist: ChecklistDataService;
  readonly lists: ListDataService;
  readonly organizations: OrganizationDataService;
  readonly projects: ProjectDataService;
  readonly projectNodes: ProjectNodeDataService;
  readonly projectSnapshots: ProjectSnapshotDataService;
  readonly resources: ResourcesDataService;
  readonly users: UserDataService;

  constructor(ctx: Context) {
    this.activities = new ActivityDataService(ctx);
    this.checklist = new ChecklistDataService(ctx);
    this.lists = new ListDataService(ctx);
    this.organizations = new OrganizationDataService(ctx);
    this.projects = new ProjectDataService(ctx);
    this.projectNodes = new ProjectNodeDataService(ctx);
    this.projectSnapshots = new ProjectSnapshotDataService(ctx);
    this.resources = new ResourcesDataService(ctx);
    this.users = new UserDataService(ctx);
  }
}
