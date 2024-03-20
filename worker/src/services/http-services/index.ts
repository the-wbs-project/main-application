import { AiChatHttpService } from './ai-chat.http-service';
import { ChatHttpService } from './chat.http-service';
import { ClaimsHttpService } from './claims.http-service';
import { JiraHttpService } from './jira.http-service';
import { LibraryEntryHttpService } from './library-entry.http-service';
import { LibraryExportHttpService } from './library-export.http-services';
import { MetadataHttpService } from './metdata.http-service';
import { MiscHttpService } from './misc.http-service';
import { OrganizationHttpService } from './organization.http-service';
import { ProjectHttpService } from './project.http-service';
import { ResourceFileHttpService } from './resources.http-services';
import { StaticsHttpService } from './statics.http-services';

export const Http = {
  aiChat: AiChatHttpService,
  chat: ChatHttpService,
  claims: ClaimsHttpService,
  jira: JiraHttpService,
  libraryEntries: LibraryEntryHttpService,
  libraryExport: LibraryExportHttpService,
  metadata: MetadataHttpService,
  misc: MiscHttpService,
  organizations: OrganizationHttpService,
  projects: ProjectHttpService,
  resourceFiles: ResourceFileHttpService,
  statics: StaticsHttpService,
};
