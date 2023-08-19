import { Context } from '../../config';
import { ListItem, Resources } from '../../models';

export class MetadataHttpService {
  static async getResourcesAsync(ctx: Context): Promise<Response> {
    try {
      return ctx.json(await ctx.get('data').resources.getAsync('en-US'));
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to get resources.', <Error>e);

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
      ctx.get('logger').trackException('An error occured trying to get a list.', <Error>e);

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
      ctx.get('logger').trackException('An error occured trying to get resources.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async putListAsync(ctx: Context): Promise<Response> {
    try {
      const { name } = ctx.req.param();

      if (!name) return ctx.text('Missing Parameters', 500);

      const db = ctx.get('data').lists;
      const list: ListItem[] = await ctx.req.json();
      const existing = await db.getAsync(name);
      const existingIds = existing?.map((x) => x.id) ?? [];

      for (const r of list) {
        ctx.executionCtx.waitUntil(db.putAsync(r));

        if (existingIds.indexOf(r.id) > -1) {
          existingIds.splice(existingIds.indexOf(r.id), 1);
        }
      }
      //
      //  Delete any items that were not in the new list
      //
      for (const id of existingIds) {
        ctx.executionCtx.waitUntil(db.deleteAsync(name, id));
      }

      return ctx.text('', 204);
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to get resources.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }
}
