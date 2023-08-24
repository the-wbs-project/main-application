import { Context } from '../../config';
import { ListItem, Resources } from '../../models';

export class MetadataHttpService {
  static async setResourcesAsync(ctx: Context): Promise<Response> {
    try {
      const data = ctx.get('data').resources;
      const resources: Resources[] = await ctx.req.json();

      for (const r of resources) {
        ctx.executionCtx.waitUntil(data.putAsync(r));
      }
      return ctx.text('', 204);
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to get resources.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async putListAsync(ctx: Context): Promise<Response> {
    try {
      const { type } = ctx.req.param();

      if (!type) return ctx.text('Missing Parameters', 500);

      const data = ctx.get('data').lists;
      const list: ListItem[] = await ctx.req.json();
      const existing = await data.getAsync(type);

      const existingIds = existing?.map((x) => x.id) ?? [];

      for (const r of list) {
        ctx.executionCtx.waitUntil(data.putAsync(r));

        if (existingIds.indexOf(r.id) > -1) {
          existingIds.splice(existingIds.indexOf(r.id), 1);
        }
      }
      //
      //  Delete any items that were not in the new list
      //
      for (const id of existingIds) {
        ctx.executionCtx.waitUntil(data.deleteAsync(type, id));
      }

      return ctx.text('', 204);
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to get resources.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }
}
