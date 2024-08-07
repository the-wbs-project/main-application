import { Context } from '../../config';
import { ListItem, Resources } from '../../models';
import { ResourceService } from '../resource.service';

export class MetadataHttpService {
  static async getListsAsync(ctx: Context): Promise<Response> {
    const types = ['project_category', 'categories_phase', 'categories_discipline'];
    const { type, locale } = ctx.req.param();
    const list = await ctx.var.data.lists.getAsync(type);

    if (!types.includes(type)) return ctx.json(list);

    const resourceObj = await ctx.var.data.resources.getAsync(locale);
    const resources = new ResourceService(resourceObj!);

    for (const item of list!) {
      if (item.label) item.label = resources.get(item.label);
      if (item.description) item.description = resources.get(item.description);
    }

    return ctx.json(list);
  }
  static async putResourcesAsync(ctx: Context): Promise<Response> {
    try {
      const data = ctx.get('data').resources;
      const resources: Resources[] = await ctx.req.json();

      for (const r of resources) {
        ctx.executionCtx.waitUntil(data.putAsync(r));
      }
      return ctx.newResponse(null, { status: 204 });
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
      const existing = (await data.getAsync(type)) ?? [];

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

      return ctx.newResponse(null, { status: 204 });
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to get resources.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async putChecklistsAsync(ctx: Context): Promise<Response> {
    try {
      const data = await ctx.req.json();

      await ctx.get('origin').putAsync(data, 'checklists');

      return ctx.newResponse(null, { status: 204 });
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to set checklists.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }
}
