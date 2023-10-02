import { Context } from '../../config';
import { AiChatDataService } from './ai-chat.data-service';
import { ListDataService } from './list.data-service';
import { ResourcesDataService } from './resources.data-service';

export class DataServiceFactory {
  readonly chat: AiChatDataService;
  readonly lists: ListDataService;
  readonly resources: ResourcesDataService;

  constructor(ctx: Context) {
    this.chat = new AiChatDataService(ctx);
    this.lists = new ListDataService(ctx);
    this.resources = new ResourcesDataService(ctx);
  }
}
