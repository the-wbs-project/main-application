import { Context } from '../../config';
import { AiChatDataService } from './ai-chat.data-service';
import { LibraryEntryDataService } from './library-entry.data-service';
import { ListDataService } from './list.data-service';
import { OrganizationDataService } from './organization.data-service';
import { ProjectDataService } from './project.data-service';
import { ResourcesDataService } from './resources.data-service';
import { RolesDataService } from './roles.data-service';
import { StorageService } from './storage.service';
import { UserDataService } from './user.data-service';

export class DataServiceFactory {
  readonly aiChat: AiChatDataService;
  readonly entries: LibraryEntryDataService;
  readonly lists: ListDataService;
  readonly organizations: OrganizationDataService;
  readonly projects: ProjectDataService;
  readonly resourceFiles: StorageService;
  readonly resources: ResourcesDataService;
  readonly roles: RolesDataService;
  readonly statics: StorageService;
  readonly users: UserDataService;

  constructor(ctx: Context) {
    this.aiChat = new AiChatDataService(ctx);
    this.entries = new LibraryEntryDataService(ctx);
    this.lists = new ListDataService(ctx);
    this.organizations = new OrganizationDataService(ctx);
    this.projects = new ProjectDataService(ctx);
    this.resourceFiles = new StorageService(ctx.env.BUCKET_RESOURCES);
    this.resources = new ResourcesDataService(ctx);
    this.roles = new RolesDataService(ctx);
    this.statics = new StorageService(ctx.env.BUCKET_STATICS);
    this.users = new UserDataService(ctx);
  }
}
