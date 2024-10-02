import { Context } from '../../config';
import { Activity } from '../../models';
import { Transformers } from '../transformers';

export class ActivitiesHttpService {
  static async getAsync(ctx: Context): Promise<Response> {
    try {
      const { owner, topLevel, skip, take } = ctx.req.param();
      const url = `api/activities/topLevel/${topLevel}/${skip}/${take}`;

      const list = (await ctx.var.origin.getAsync<Activity[]>(url)) ?? [];
      const userIds = [...new Set(list.map((x) => x.userId))];
      const users = await ctx.var.data.users.getViewsAsync(owner, userIds, 'organization');

      return ctx.json(Transformers.activity.toViewModelList(list, users));
    } catch (e) {
      console.log(JSON.stringify(e));
      ctx.var.logger.trackException('An error occured trying to get activities', <Error>e);
      return ctx.text('Internal Server Error', 500);
    }
  }

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
      ctx.var.logger.trackException('An error occured trying to save activities', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }
}
