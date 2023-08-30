import { Context } from '../config';

export class SnapshotService {
  static async takeAsync(ctx: Context, ownerId: string, projectId: string, activityId: string): Promise<void> {
    const data = ctx.get('data');

    //const [project, tasks] = await Promise.all([data.projects.getAsync(ownerId, projectId), data.projectNodes.getAllAsync(projectId)]);

    //await ctx.get('data').projectSnapshots.putAsync(activityId, {
    //...project!,
    //tasks,
    //});
  }
}
