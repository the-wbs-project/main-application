import { Context } from '../../config';
import { Activity, PROJECT_ACTIONS, UserProfile } from '../../models';
import { ProjectActivitiesService } from '../activities';

export class ProjectActivitiesHttpService {
  static async postAsync(ctx: Context): Promise<Response> {
    try {
      const { owner, projectId } = await ctx.req.param();
      const activities: Activity[] = await ctx.req.json();
      //
      //  Save the activities to the database
      //
      const response = await ctx.var.origin.postAsync(activities, 'activities');

      if (response.status >= 300) return ctx.newResponse(null, response.status);
      //
      //  Now get the snapshot for each activity
      //
      ctx.executionCtx.waitUntil(this.saveSnapshots(ctx, owner, projectId, activities));
      //
      //  Now we check for activities which need emails
      //
      const activityService = new ProjectActivitiesService();

      ctx.executionCtx.waitUntil(activityService.processAsync(ctx, owner, projectId, activities));

      return ctx.newResponse(null, response.status);
    } catch (e) {
      ctx.var.logger.trackException('An error occured trying to save activities', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  private static async saveSnapshots(ctx: Context, owner: string, projectId: string, activities: Activity[]) {
    //
    //  Now get the snapshot for each activity
    //
    for (const activity of activities) {
      await ctx.var.origin.postAsync(activity.id, `api/portfolio/${owner}/projects/${projectId}/snapshot`);
    }
  }

  private static async checkActivitiesForEmails(ctx: Context, owner: string, projectId: string, activities: Activity[]) {
    const project = await ctx.var.data.projects.getByIdAsync(owner, projectId);
    const organization = await ctx.var.data.organizations.getByIdAsync(owner);
    let users = new Map<string, UserProfile>();

    for (const activity of activities) {
      if (activity.action === PROJECT_ACTIONS.ADDED_USER) {
        const userId = activity.data.user;
        const role = activity.data.role;
        let user: UserProfile | undefined;

        if (users.has(userId)) {
          user = users.get(userId);
        } else {
          user = await ctx.var.data.users.getUserAsync(userId);
          users.set(userId, user);
        }
        await ctx.env.PROJECT_ASSIGNMENT_QUEUE.send({
          role,
          user: user!,
          assignment: 'added',
          organizationName: organization!.name,
          projectName: project!.title,
          link: `${ctx.env.SITE_URL}/portfolio/${owner}/projects/${projectId}`,
        });
        /*{
  role: roleTitle,
  user: user.userId,
  userName: user.fullName,
}*/
        //
      } else if (activity.action === PROJECT_ACTIONS.REMOVED_USER) {
        //
      }
    }
    //
  }
}
