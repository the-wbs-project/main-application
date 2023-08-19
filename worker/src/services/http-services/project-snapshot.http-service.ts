import { Context } from '../../config';
import { SnapshotService } from '../snapshot.service';

export class ProjectSnapshotHttpService {
  static async getByActivityIdAsync(ctx: Context): Promise<Response> {
    try {
      const { owner, projectId, activityId } = ctx.req.param();

      if (!owner || !projectId || !activityId) return ctx.text('Missing Parameters', 500);

      return ctx.json(await ctx.get('data').projectSnapshots.getAsync(owner, projectId, activityId));
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to get a project snapshot.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static take(ctx: Context): Response {
    try {
      const { owner, projectId, activityId } = ctx.req.param();

      if (!owner || !projectId || !activityId) return ctx.text('Missing Parameters', 500);

      ctx.executionCtx.waitUntil(SnapshotService.takeAsync(ctx, owner, projectId, activityId));

      return ctx.text('', 204);
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to take a snapshot of a project.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }
}
