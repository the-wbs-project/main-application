import { Context } from '../../config';

export class WatcherHttpService {
  static async getWatchedAsync(ctx: Context): Promise<Response> {
    try {
      const user = ctx.var.userId;

      return ctx.json(await ctx.var.data.watchers.getWatchedAsync(user));
    } catch (e) {
      ctx.var.logger.trackException("An error occured trying to get a user's watched items.", <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async getWatchersAsync(ctx: Context): Promise<Response> {
    try {
      const { owner, id } = await ctx.req.json();

      return ctx.json(await ctx.var.data.watchers.getWatchersAsync(owner, id));
    } catch (e) {
      ctx.var.logger.trackException('An error occured trying to get watchers.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async getWatcherCountAsync(ctx: Context): Promise<Response> {
    try {
      const { owner, id } = await ctx.req.json();

      return ctx.json(await ctx.var.data.watchers.getWatcherCountAsync(owner, id));
    } catch (e) {
      ctx.var.logger.trackException('An error occured trying to get watcher count.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }
}
