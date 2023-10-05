import { ChatHttpService } from './chat.http-service';
import { JiraHttpService } from './jira.http-service';
import { MetadataHttpService } from './metdata.http-service';
import { MiscHttpService } from './misc.http-service';

export const Http = {
  chat: ChatHttpService,
  jira: JiraHttpService,
  metadata: MetadataHttpService,
  misc: MiscHttpService,
};
