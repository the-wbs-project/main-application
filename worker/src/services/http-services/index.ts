import { AiChatHttpService } from './ai-chat.http-service';
import { ChatHttpService } from './chat.http-service';
import { ClaimsHttpService } from './claims.http-service';
import { JiraHttpService } from './jira.http-service';
import { MetadataHttpService } from './metdata.http-service';
import { MiscHttpService } from './misc.http-service';
import { ProjectHttpService } from './project.http-service';

export const Http = {
  aiChat: AiChatHttpService,
  chat: ChatHttpService,
  claims: ClaimsHttpService,
  jira: JiraHttpService,
  metadata: MetadataHttpService,
  misc: MiscHttpService,
  projects: ProjectHttpService,
};
