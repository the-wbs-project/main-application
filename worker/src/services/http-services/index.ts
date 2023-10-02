import { ChatHttpService } from './chat.http-service';
import { MetadataHttpService } from './metdata.http-service';
import { MiscHttpService } from './misc.http-service';

export const Http = {
  chat: ChatHttpService,
  metadata: MetadataHttpService,
  misc: MiscHttpService,
};
