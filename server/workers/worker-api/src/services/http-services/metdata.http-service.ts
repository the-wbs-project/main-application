import { Context } from '../../config';
import { ListItem, Resources } from '../../models';
import { ResourceService } from '../resource.service';

export class MetadataHttpService {
  static async getStarterKitAsync(ctx: Context): Promise<Response> {
    const key = 'STARTER_DATA';

    const kvData = await ctx.env.KV_DATA.get<any>(key, 'json');

    if (kvData) return ctx.json(kvData);

    const resources = await ctx.var.data.resources.getAsync('en-US');
    const resourceService = new ResourceService(resources!);

    const [projectCategories, phases, disciplines, roles] = await Promise.all([
      MetadataHttpService.getCategoriesAsync(ctx, resourceService, 'project_category'),
      MetadataHttpService.getCategoriesAsync(ctx, resourceService, 'categories_phase'),
      MetadataHttpService.getCategoriesAsync(ctx, resourceService, 'categories_discipline'),
      ctx.var.data.roles.getAllAsync(),
    ]);

    const data = {
      resources,
      projectCategories,
      phases,
      disciplines,
      roles,
    };

    await ctx.env.KV_DATA.put(key, JSON.stringify(data));

    return ctx.json(data);
  }

  static async putResourcesAsync(ctx: Context): Promise<Response> {
    try {
      const data = ctx.var.data.resources;
      const resources: Resources[] = await ctx.req.json();

      for (const r of resources) {
        ctx.executionCtx.waitUntil(data.putAsync(r));
      }
      await ctx.env.KV_DATA.delete('STARTER_DATA');

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
        await data.deleteAsync(type, id);
      }
      await ctx.env.KV_DATA.delete('STARTER_DATA');

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

  private static async getCategoriesAsync(ctx: Context, resources: ResourceService, type: string): Promise<ListItem[]> {
    const list = (await ctx.var.data.lists.getAsync(type)) ?? [];

    for (const item of list) {
      if (item.label) item.label = resources.get(item.label);
      if (item.description) item.description = resources.get(item.description);
    }

    return list;
  }
}
