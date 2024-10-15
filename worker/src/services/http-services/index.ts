import { ActivitiesHttpService } from './activities.http-service';
import { AiChatHttpService } from './ai-chat.http-service';
import { AiHttpService } from './ai.http-service';
import { ChatHttpService } from './chat.http-service';
import { ClaimsHttpService } from './claims.http-service';
import { ContentResourceHttpService } from './content-resources.http-service';
import { InviteHttpService } from './invite.http-service';
import { JiraHttpService } from './jira.http-service';
import { LibraryEntryHttpService } from './library-entry.http-service';
import { LibraryHttpService } from './library.http-service';
import { MembersHttpService } from './members.http-service';
import { MetadataHttpService } from './metdata.http-service';
import { MiscHttpService } from './misc.http-service';
import { OnboardHttpService } from './onboard.http-service';
import { ProjectActivitiesHttpService } from './project-activities.http-service';
import { ProjectHttpService } from './project.http-service';
import { UserHttpService } from './user.http-service';

export const Http = {
  activities: ActivitiesHttpService,
  ai: AiHttpService,
  aiChat: AiChatHttpService,
  chat: ChatHttpService,
  claims: ClaimsHttpService,
  contentResources: ContentResourceHttpService,
  invites: InviteHttpService,
  jira: JiraHttpService,
  library: LibraryHttpService,
  libraryEntries: LibraryEntryHttpService,
  members: MembersHttpService,
  metadata: MetadataHttpService,
  misc: MiscHttpService,
  onboard: OnboardHttpService,
  projects: ProjectHttpService,
  projectActivities: ProjectActivitiesHttpService,
  users: UserHttpService,
};
