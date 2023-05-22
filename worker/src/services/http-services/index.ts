import { ActivityHttpService } from './activity.http-service';
import { ChecklistHttpService } from './checklist.http-service';
import { DiscussionHttpService } from './discussion.http-service';
import { InviteHttpService } from './invite.http-service';
import { MetadataHttpService } from './metdata.http-service';
import { MiscHttpService } from './misc.http-service';
import { ProjectNodeHttpService } from './project-node.http-service';
import { ProjectSnapshotHttpService } from './project-snapshot.http-service';
import { ProjectHttpService } from './project.http-service';
import { UserHttpService } from './user.http-service';

export const Http = {
  activity: ActivityHttpService,
  checklists: ChecklistHttpService,
  discussions: DiscussionHttpService,
  invites: InviteHttpService,
  metadata: MetadataHttpService,
  misc: MiscHttpService,
  project: ProjectHttpService,
  projectNodes: ProjectNodeHttpService,
  projectSnapshots: ProjectSnapshotHttpService,
  users: UserHttpService,
};
