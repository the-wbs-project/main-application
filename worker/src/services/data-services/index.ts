import { Context } from '../../config';
import { ChecklistDataService } from './checklist.data-service';
import { ListDataService } from './list.data-service';
import { OrganizationDataService } from './organization.data-service';
import { ProjectSnapshotDataService } from './project-snapshot.data-service';
import { ResourcesDataService } from './resources.data-service';
import { UserDataService } from './user.data-service';

export class DataServiceFactory {
  readonly checklist: ChecklistDataService;
  readonly lists: ListDataService;
  readonly organizations: OrganizationDataService;
  readonly projectSnapshots: ProjectSnapshotDataService;
  readonly resources: ResourcesDataService;
  readonly users: UserDataService;

  constructor(ctx: Context) {
    this.checklist = new ChecklistDataService(ctx);
    this.lists = new ListDataService(ctx);
    this.organizations = new OrganizationDataService(ctx);
    this.projectSnapshots = new ProjectSnapshotDataService(ctx);
    this.resources = new ResourcesDataService(ctx);
    this.users = new UserDataService(ctx);
  }
}
