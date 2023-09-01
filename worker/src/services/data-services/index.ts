import { Context } from '../../config';
import { ListDataService } from './list.data-service';
import { OrganizationDataService } from './organization.data-service';
import { ResourcesDataService } from './resources.data-service';
import { UserDataService } from './user.data-service';

export class DataServiceFactory {
  readonly lists: ListDataService;
  readonly organizations: OrganizationDataService;
  readonly resources: ResourcesDataService;
  readonly users: UserDataService;

  constructor(ctx: Context) {
    this.lists = new ListDataService(ctx);
    this.organizations = new OrganizationDataService(ctx);
    this.resources = new ResourcesDataService(ctx);
    this.users = new UserDataService(ctx);
  }
}
