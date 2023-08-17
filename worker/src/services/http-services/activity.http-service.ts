import { Context } from '../../config';
import { Activity } from '../../models';

export class ActivityHttpService {
  static async getByIdAsync(ctx: Context): Promise<Response> {
    try {
      const { topLevelId, childId, skip, take } = ctx.req.param();
      const data = await ctx.get('data');

      if (!topLevelId || !skip || !take) return ctx.text('Missing Parameters', 500);

      const skip2 = parseInt(skip);
      const take2 = parseInt(take);

      if (isNaN(skip2) || isNaN(take2)) return ctx.text('Invalid Parameters', 500);

      const list = childId
        ? await data.activities.getByChildAsync(topLevelId, childId, skip2, take2)
        : await data.activities.getByTopLevelAsync(topLevelId, skip2, take2);

      return ctx.json(list);
    } catch (e) {
      ctx
        .get('logger')
        .trackException('An error occured trying to get all activity for an object.', 'ActivityHttpService.getByIdAsync', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async getByUserIdAsync(ctx: Context): Promise<Response> {
    try {
      const { userId } = ctx.req.param();

      if (!userId) return ctx.text('Missing Parameters', 500);

      return ctx.json(await ctx.get('data').userActivities.getAllAsync(userId));
    } catch (e) {
      ctx
        .get('logger')
        .trackException('An error occured trying to get all activity for a user.', 'ActivityHttpService.getByUserIdAsync', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async putAsync(ctx: Context): Promise<Response> {
    try {
      const { owner, dataType } = ctx.req.param();

      if (!owner || !dataType) return ctx.text('Missing Parameters', 500);

      const activity: Activity = await ctx.req.json();
      const data = ctx.get('data');

      activity.userId = ctx.get('user').id;

      await data.activities.putAsync(activity);

      if (dataType === 'project') {
        const [project, tasks] = await Promise.all([
          data.projects.getAsync(owner, activity.topLevelId),
          data.projectNodes.getAllAsync(activity.topLevelId),
        ]);
        await ctx.get('data').projectSnapshots.putAsync(activity.id, {
          ...project!,
          tasks,
        });
      }

      await ctx.get('data').userActivities.putAsync(activity);

      return ctx.text('', 204);
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to insert an activity.', 'ActivityHttpService.putAsync', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }
}
