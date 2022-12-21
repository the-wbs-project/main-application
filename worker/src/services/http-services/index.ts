import { ActivityHttpService } from './activity.http-service';
import { AuthorizationHttpService } from './authorization.http-service';
import { AzureHttpService } from './azure.http-service';
import { BaseHttpService } from './base.http-service';
import { DiscussionHttpService } from './discussion.http-service';
import { InviteHttpService } from './invite.http-service';
import { MetadataHttpService } from './metdata.http-service';
import { ProjectNodeHttpService } from './project-node.http-service';
import { ProjectSnapshotHttpService } from './project-snapshot.http-service';
import { ProjectHttpService } from './project.http-service';
import { SiteHttpService } from './site.http-service';
import { UserHttpService } from './user.http-service';

export const Http = {
  activity: ActivityHttpService,
  auth: AuthorizationHttpService,
  azure: AzureHttpService,
  discussions: DiscussionHttpService,
  invites: InviteHttpService,
  metadata: MetadataHttpService,
  project: ProjectHttpService,
  projectNodes: ProjectNodeHttpService,
  projectSnapshots: ProjectSnapshotHttpService,
  site: SiteHttpService,
  users: UserHttpService,

  json: BaseHttpService.buildJson,
};
