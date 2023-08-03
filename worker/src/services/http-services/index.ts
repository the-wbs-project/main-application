import { ActivityHttpService } from './activity.http-service';
import { ChecklistHttpService } from './checklist.http-service';
import { DiscussionHttpService } from './discussion.http-service';
import { InviteHttpService } from './invite.http-service';
import { MembershipHttpService } from './membership.http-service';
import { MetadataHttpService } from './metdata.http-service';
import { MiscHttpService } from './misc.http-service';
import { ProfileHttpService } from './profile.http-service';
import { ProjectNodeHttpService } from './project-node.http-service';
import { ProjectSnapshotHttpService } from './project-snapshot.http-service';
import { ProjectHttpService } from './project.http-service';

export const Http = {
  activities: ActivityHttpService,
  checklists: ChecklistHttpService,
  discussions: DiscussionHttpService,
  invites: InviteHttpService,
  memberships: MembershipHttpService,
  metadata: MetadataHttpService,
  misc: MiscHttpService,
  profile: ProfileHttpService,
  projects: ProjectHttpService,
  projectNodes: ProjectNodeHttpService,
  projectSnapshots: ProjectSnapshotHttpService,
};
