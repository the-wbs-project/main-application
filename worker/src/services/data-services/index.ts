import { Context } from '../../config';
import { ActivityDataService } from './activity.data-service';
import { AuthDataService } from './auth.data-service';
import { ChecklistDataService } from './checklist.data-service';
import { DiscussionDataService } from './discussion.data-service';
import { InviteDataService } from './invite.data-service';
import { ListDataService } from './list.data-service';
import { MembershipDataService } from './membership.data-service';
import { OrganizationDataService } from './organization.data-service';
import { ProjectNodeDataService } from './project-node.data-service';
import { ProjectSnapshotDataService } from './project-snapshot.data-service';
import { ProjectDataService } from './project.data-service';
import { ResourcesDataService } from './resources.data-service';
import { UserActivityDataService } from './user-activity.data-service';

export class DataServiceFactory {
  readonly activities = new ActivityDataService(this.ctx);
  readonly auth = new AuthDataService(this.ctx);
  readonly checklist = new ChecklistDataService(this.ctx);
  readonly discussions = new DiscussionDataService(this.ctx);
  readonly invites = new InviteDataService(this.ctx);
  readonly lists = new ListDataService(this.ctx);
  readonly membership = new MembershipDataService(this.ctx);
  readonly organization = new OrganizationDataService(this.ctx);
  readonly projects = new ProjectDataService(this.ctx);
  readonly projectNodes = new ProjectNodeDataService(this.ctx);
  readonly projectSnapshots = new ProjectSnapshotDataService(this.ctx);
  readonly resources = new ResourcesDataService(this.ctx);
  readonly userActivities = new UserActivityDataService(this.ctx);

  constructor(private readonly ctx: Context) {}
}
