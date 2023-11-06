import { Context } from '../../config';
import { AiChatDataService } from './ai-chat.data-service';
import { ListDataService } from './list.data-service';
import { ResourcesDataService } from './resources.data-service';
import { RolesDataService } from './roles.data-service';
import { UserDataService } from './user.data-service';

export class DataServiceFactory {
  readonly aiChat: AiChatDataService;
  readonly lists: ListDataService;
  readonly resources: ResourcesDataService;
  readonly roles: RolesDataService;
  readonly user: UserDataService;

  constructor(ctx: Context) {
    this.aiChat = new AiChatDataService(ctx);
    this.lists = new ListDataService(ctx);
    this.resources = new ResourcesDataService(ctx);
    this.roles = new RolesDataService(ctx);
    this.user = new UserDataService(ctx);
  }
}
