import { Context } from '../../config';

export class ProjectNodeHttpService {
  static async migrateAsync(ctx: Context): Promise<Response> {
    try {
      await ctx.get('data').projectNodes.migrateAsync();

      return ctx.text('', 204);
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to insert an activity.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }
}
