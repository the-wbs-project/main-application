import { Context } from '../../config';
import { Resources } from '../../models';

export class MetadataHttpService {
  static async getResourcesAsync(ctx: Context): Promise<Response> {
    try {
      return ctx.json(await ctx.get('data').resources.getAsync('en-US'));
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to get resources.', 'MetadataHttpService.getResourcesAsync', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async getListAsync(ctx: Context): Promise<Response> {
    try {
      const { name } = ctx.req.param();

      if (!name) return ctx.text('Missing Parameters', 500);
      //
      //  Get the data from the KV
      //
      const data = await ctx.get('data').lists.getAsync(name);

      return ctx.json(data);
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to get a list.', 'MetadataHttpService.getListAsync', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async setResourcesAsync(ctx: Context): Promise<Response> {
    try {
      const resources: Resources[] = await ctx.req.json();

      for (const r of resources) {
        ctx.executionCtx.waitUntil(ctx.get('data').resources.putAsync(r));
      }
      return ctx.text('', 204);
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to get resources.', 'MetadataHttpService.getResourcesAsync', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }
}
