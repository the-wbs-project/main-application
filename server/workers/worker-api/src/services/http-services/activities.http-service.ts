import { Context } from '../../config';

export class ActivitiesHttpService {
  static async postAsync(ctx: Context): Promise<Response> {
    try {
      const { type, owner, activities } = await ctx.req.json();
      const response = await ctx.var.origin.postAsync(activities, 'activities');

      if (type === 'project' && response.status < 300) {
        const projectId = activities[0].topLevelId;
        const snapshotUrl = `api/portfolio/${owner}/projects/${projectId}/snapshot`;

        for (const activity of activities) {
          ctx.executionCtx.waitUntil(ctx.var.origin.postAsync(activity.id, snapshotUrl));
        }
      }

      return ctx.newResponse(null, response.status);
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to get chat info', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }
}
