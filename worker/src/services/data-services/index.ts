import { Context } from '../../config';
import { ListDataService } from './list.data-service';
import { ResourcesDataService } from './resources.data-service';

export class DataServiceFactory {
  readonly lists: ListDataService;
  readonly resources: ResourcesDataService;

  constructor(ctx: Context) {
    this.lists = new ListDataService(ctx);
    this.resources = new ResourcesDataService(ctx);
  }
}
