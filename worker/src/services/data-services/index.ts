import { Context } from '../../config';
import { ActivityDataService } from './activity.data-service';
import { AuthDataService } from './auth.data-service';
import { ChecklistDataService } from './checklist.data-service';
import { DiscussionDataService } from './discussion.data-service';
import { InviteDataService } from './invite.data-service';
import { ListDataService } from './list.data-service';
import { ProjectNodeDataService } from './project-node.data-service';
import { ProjectSnapshotDataService } from './project-snapshot.data-service';
import { ProjectDataService } from './project.data-service';
import { ResourcesDataService } from './resources.data-service';
import { UserActivityDataService } from './user-activity.data-service';

export class DataServiceFactory {
  readonly activities: ActivityDataService;
  readonly auth: AuthDataService;
  readonly checklist: ChecklistDataService;
  readonly discussionsCorporate: DiscussionDataService;
  readonly discussionsGlobal: DiscussionDataService;
  readonly invites: InviteDataService;
  readonly lists: ListDataService;
  readonly projects: ProjectDataService;
  readonly projectNodes: ProjectNodeDataService;
  readonly resources: ResourcesDataService;
  readonly userActivities: UserActivityDataService;
  readonly projectSnapshots: ProjectSnapshotDataService;

  constructor(ctx: Context) {
    this.activities = new ActivityDataService(ctx);
    this.auth = new AuthDataService(ctx);
    this.checklist = new ChecklistDataService(ctx);
    this.discussionsCorporate = new DiscussionDataService(ctx, false);
    this.discussionsGlobal = new DiscussionDataService(ctx, true);
    this.invites = new InviteDataService(ctx);
    this.lists = new ListDataService(ctx);
    this.projects = new ProjectDataService(ctx);
    this.projectNodes = new ProjectNodeDataService(ctx);
    this.projectSnapshots = new ProjectSnapshotDataService(ctx, this.projects, this.projectNodes);
    this.resources = new ResourcesDataService(ctx);
    this.userActivities = new UserActivityDataService(ctx);
  }
}
