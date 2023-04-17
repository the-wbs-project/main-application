import { Context } from '../../config';

export class ProjectSnapshotHttpService {
  static async getByActivityIdAsync(ctx: Context): Promise<Response> {
    try {
      const { projectId, activityId } = ctx.req.param();

      if (!projectId || !activityId) return ctx.text('Missing Parameters', 500);

      return ctx.json(await ctx.get('data').projectSnapshots.getAsync(projectId, activityId));
    } catch (e) {
      ctx
        .get('logger')
        .trackException('An error occured trying to get a project snapshot.', 'ProjectSnapshotHttpService.getByActivityIdAsync', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }
}
