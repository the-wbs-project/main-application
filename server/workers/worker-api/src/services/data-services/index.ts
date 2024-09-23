import { Context, ContextLocal } from '../../config';
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

  constructor(ctx: ContextLocal) {
    //
    //  Auth
    //
    this.invites = new InvitesDataService(ctx.env.AUTH_API);
    this.memberships = new MembershipDataService(ctx.env.AUTH_API);
    this.organizations = new OrganizationDataService(ctx.env.AUTH_API);
    this.roles = new RolesDataService(ctx.env.AUTH_API);
    this.users = new UserDataService(ctx.env.AUTH_API);
    //
    //  Simple
    //
    this.aiChat = new AiChatDataService(ctx);
    this.contentResources = new ContentResourcesDataService(ctx);
    this.entries = new LibraryEntryDataService(ctx);
    this.libraryEntries = new LibraryEntryDataService(ctx);
    this.libraryTasks = new LibraryEntryTaskDataService(ctx);
    this.libraryVersions = new LibraryEntryVersionDataService(ctx);
    this.lists = new ListDataService(ctx);
    this.projectApprovals = new ProjectApprovalsDataService(ctx);
    this.projectNodes = new ProjectNodeDataService(ctx);
    this.projects = new ProjectDataService(ctx);
    this.resources = new ResourcesDataService(ctx);
    //
    //  Complex
    //
  }
}
