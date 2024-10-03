import { Env } from '../../config';
import { OriginService } from '../origin-services';
import { AiChatDataService } from './ai-chat.data-service';
import { ContentResourcesDataService } from './content-resources.data-services';
import { InvitesDataService } from './invites.data-service';
import { LibraryEntryTaskDataService } from './library-entry-tasks.data-service';
import { LibraryEntryVersionDataService } from './library-entry-version.data-service';
import { LibraryEntryDataService } from './library-entry.data-service';
import { ListDataService } from './list.data-service';
import { MembershipDataService } from './membership.data-service';
import { OrganizationDataService } from './organization.data-service';
import { ProjectApprovalsDataService } from './project-approvals.data-service';
import { ProjectNodeDataService } from './project-node.data-service';
import { ProjectDataService } from './project.data-service';
import { ResourcesDataService } from './resources.data-service';
import { RolesDataService } from './roles.data-service';
import { UserDataService } from './user.data-service';
import { WatcherDataService } from './watcher.data-service';

export class DataServiceFactory {
  readonly aiChat: AiChatDataService;
  readonly contentResources: ContentResourcesDataService;
  readonly entries: LibraryEntryDataService;
  readonly invites: InvitesDataService;
  readonly libraryEntries: LibraryEntryDataService;
  readonly libraryTasks: LibraryEntryTaskDataService;
  readonly libraryVersions: LibraryEntryVersionDataService;
  readonly lists: ListDataService;
  readonly memberships: MembershipDataService;
  readonly organizations: OrganizationDataService;
  readonly projectApprovals: ProjectApprovalsDataService;
  readonly projectNodes: ProjectNodeDataService;
  readonly projects: ProjectDataService;
  readonly resources: ResourcesDataService;
  readonly roles: RolesDataService;
  readonly users: UserDataService;
  readonly watchers: WatcherDataService;
  constructor(env: Env, executionCtx: ExecutionContext, origin: OriginService) {
    //
    //  Auth
    //
    this.invites = new InvitesDataService(env.AUTH_API);
    this.memberships = new MembershipDataService(env.AUTH_API);
    this.organizations = new OrganizationDataService(env.AUTH_API);
    this.roles = new RolesDataService(env.AUTH_API);
    this.users = new UserDataService(env.AUTH_API);
    //
    //  Simple
    //
    this.aiChat = new AiChatDataService(env, executionCtx);
    this.contentResources = new ContentResourcesDataService(env, executionCtx, origin);
    this.entries = new LibraryEntryDataService(env, executionCtx, origin);
    this.libraryEntries = new LibraryEntryDataService(env, executionCtx, origin);
    this.libraryTasks = new LibraryEntryTaskDataService(env, executionCtx, origin);
    this.libraryVersions = new LibraryEntryVersionDataService(env, executionCtx, origin);
    this.lists = new ListDataService(env, executionCtx, origin);
    this.projectApprovals = new ProjectApprovalsDataService(env, executionCtx, origin);
    this.projectNodes = new ProjectNodeDataService(env, executionCtx, origin);
    this.projects = new ProjectDataService(env, executionCtx, origin);
    this.resources = new ResourcesDataService(env, executionCtx, origin);
    this.watchers = new WatcherDataService(env, executionCtx, origin);
    //
    //  Complex
    //
  }
}
