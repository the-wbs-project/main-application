import { Context } from '../../config';

export class ProjectHttpService {
  static async getAllAsync(ctx: Context): Promise<Response | void> {
    try {
      return ctx.json(await ctx.get('data').projects.getAllAsync());
    } catch (e) {
      ctx
        .get('logger')
        .trackException('An error occured trying to get all projects for the organization.', 'ProjectHttpService.getAllAsync', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async getAllWatchedAsync(ctx: Context): Promise<Response> {
    try {
      const userId = ctx.get('state').userId;

      return ctx.json(await ctx.get('data').projects.getAllWatchedAsync(userId));
    } catch (e) {
      ctx
        .get('logger')
        .trackException('An error occured trying to get all watched projects.', 'ProjectHttpService.getAllWatchedAsync', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async getByIdAsync(ctx: Context): Promise<Response> {
    try {
      const { projectId } = ctx.req.param();

      if (!projectId) return ctx.text('Missing Parameters', 500);

      return ctx.json(await ctx.get('data').projects.getAsync(projectId));
    } catch (e) {
      ctx.get('logger').trackException("An error occured trying to get a project by it's ID.", 'ProjectHttpService.getByIdAsync', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async putAsync(ctx: Context): Promise<Response> {
    try {
      const { projectId } = ctx.req.param();

      if (!projectId) return ctx.text('Missing Parameters', 500);

      await ctx.get('data').projects.putAsync(await ctx.req.json());

      return ctx.text('', 204);
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to update a project.', 'ProjectHttpService.putAsync', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }
}
