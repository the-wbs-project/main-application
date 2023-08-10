import { Context } from '../../config';
import { ProjectNode } from '../../models';

export class ProjectNodeHttpService {
  static async getAsync(ctx: Context): Promise<Response> {
    try {
      const { owner, projectId } = ctx.req.param();

      if (!owner || !projectId) return ctx.text('Missing Parameters', 500);
      //
      //  Get the data from the KV
      //
      return ctx.json(await ctx.get('data').projectNodes.getAllAsync(projectId));
    } catch (e) {
      ctx
        .get('logger')
        .trackException('An error occured trying to get the phase WBS list for a project.', 'ProjectNodeHttpService.getAsync', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async putAsync(ctx: Context): Promise<Response> {
    try {
      const { owner, projectId, nodeId } = ctx.req.param();
      const data = ctx.get('data');

      if (!owner || !projectId || !nodeId) return ctx.text('Missing Parameters', 500);

      await data.projectNodes.putAsync(await ctx.req.json());
      await data.projects.updateModifiedDateAsync(owner, projectId);

      return ctx.text('', 204);
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to put a node.', 'ProjectNodeHttpService.putAsync', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async batchAsync(ctx: Context): Promise<Response> {
    try {
      const { owner, projectId } = ctx.req.param();
      const data = ctx.get('data');

      if (!owner || !projectId) return ctx.text('Missing Parameters', 500);

      const { upserts, removeIds }: { upserts: ProjectNode[]; removeIds: string[] } = await ctx.req.json();

      await data.projectNodes.batchAsync(projectId, upserts, removeIds);
      await data.projects.updateModifiedDateAsync(owner, projectId);

      return ctx.text('', 204);
    } catch (e) {
      ctx
        .get('logger')
        .trackException('An error occured trying upload a batch of node changes.', 'ProjectNodeHttpService.batchAsync', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }
}
