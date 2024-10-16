import { Context } from '../../config';
import { Activity } from '../../models';

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
      //    THIS FUNCTIONALITY IS INCOMPLETE
      //
      //const activityService = new ProjectActivitiesService();

      //ctx.executionCtx.waitUntil(activityService.processAsync(ctx, owner, projectId, activities));

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
}
