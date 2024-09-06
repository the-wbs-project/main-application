import { ActivitiesHttpService } from './activities.http-service';
import { AiChatHttpService } from './ai-chat.http-service';
import { ChatHttpService } from './chat.http-service';
import { ClaimsHttpService } from './claims.http-service';
import { ContentResourceHttpService } from './content-resources.http-service';
import { InvitesHttpService } from './invites.http-service';
import { JiraHttpService } from './jira.http-service';
import { LibraryEntryHttpService } from './library-entry.http-service';
import { LibraryTaskHttpService } from './library-task.http-service';
import { LibraryVersionHttpService } from './library-version.http-service';
import { LibraryHttpService } from './library.http-service';
import { MembershipHttpService } from './membership.http-service';
import { MetadataHttpService } from './metdata.http-service';
import { MiscHttpService } from './misc.http-service';
import { OrganizationHttpService } from './organization.http-service';
import { ProjectHttpService } from './project.http-service';
import { RolesHttpService } from './roles.http-service';
import { UserHttpService } from './user.http-service';

export const Http = {
  activities: ActivitiesHttpService,
  aiChat: AiChatHttpService,
  chat: ChatHttpService,
  claims: ClaimsHttpService,
  contentResources: ContentResourceHttpService,
  invites: InvitesHttpService,
  jira: JiraHttpService,
  library: LibraryHttpService,
  libraryEntries: LibraryEntryHttpService,
  libraryTasks: LibraryTaskHttpService,
  libraryVersions: LibraryVersionHttpService,
  membership: MembershipHttpService,
  metadata: MetadataHttpService,
  misc: MiscHttpService,
  organizations: OrganizationHttpService,
  projects: ProjectHttpService,
  roles: RolesHttpService,
  users: UserHttpService,
};
