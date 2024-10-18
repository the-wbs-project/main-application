import { Context } from '../../config';
import { ListItem, Resources } from '../../models';
import { ResourceService } from '../resource.service';

const STARTER_DATA_KEY = 'STARTER_DATA';

export class MetadataHttpService {
  static async wakeUpAsync(ctx: Context): Promise<Response> {
    await ctx.var.data.resources.getFromOriginAsync('en-US');

    return ctx.newResponse(null, { status: 204 });
  }

  static async getListsAsync(ctx: Context): Promise<Response> {
    const { type, locale } = ctx.req.param();
    const [resourceObj, list] = await Promise.all([ctx.var.data.resources.getAsync(locale), ctx.var.data.lists.getAsync(type)]);

    var resources = new ResourceService(resourceObj!);

    return ctx.json(MetadataHttpService.convertCategories(resources, list ?? []));
  }

  static async getStarterKitAsync(ctx: Context): Promise<Response> {
    const kvData = await ctx.env.KV_DATA.get<any>(STARTER_DATA_KEY, 'json');

    if (kvData) return ctx.json(kvData);

    const resources = await ctx.var.data.resources.getAsync('en-US');
    const resourceService = new ResourceService(resources!);

    const [projectCategories, phases, disciplines, laborCategories] = await Promise.all([
      MetadataHttpService.getCategoriesAsync(ctx, resourceService, 'project_category'),
      MetadataHttpService.getCategoriesAsync(ctx, resourceService, 'categories_phase'),
      MetadataHttpService.getCategoriesAsync(ctx, resourceService, 'categories_discipline'),
      MetadataHttpService.getCategoriesAsync(ctx, resourceService, 'labor_categories'),
    ]);

    const data = {
      resources,
      projectCategories,
      phases,
      disciplines,
      laborCategories,
    };

    await ctx.env.KV_DATA.put(STARTER_DATA_KEY, JSON.stringify(data));

    return ctx.json(data);
  }

  static async putResourcesAsync(ctx: Context): Promise<Response> {
    try {
      const data = ctx.var.data.resources;
      const resources: Resources[] = await ctx.req.json();

      for (const r of resources) {
        await data.putAsync(r);
      }
      await ctx.env.KV_DATA.delete(STARTER_DATA_KEY);

      return ctx.newResponse(null, { status: 204 });
    } catch (e) {
      ctx.var.logger.trackException('An error occured trying to get resources.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async putListAsync(ctx: Context): Promise<Response> {
    try {
      const { type } = ctx.req.param();

      if (!type) return ctx.text('Missing Parameters', 500);

      const data = ctx.var.data.lists;
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
      await ctx.env.KV_DATA.delete(STARTER_DATA_KEY);

      return ctx.newResponse(null, { status: 204 });
    } catch (e) {
      ctx.var.logger.trackException('An error occured trying to get resources.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async putChecklistsAsync(ctx: Context): Promise<Response> {
    try {
      const data = await ctx.req.json();

      await ctx.var.origin.putAsync(data, 'checklists');

      return ctx.newResponse(null, { status: 204 });
    } catch (e) {
      ctx.var.logger.trackException('An error occured trying to set checklists.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  private static async getCategoriesAsync(ctx: Context, resources: ResourceService, type: string): Promise<ListItem[]> {
    const list = (await ctx.var.data.lists.getAsync(type)) ?? [];

    return MetadataHttpService.convertCategories(resources, list);
  }

  private static convertCategories(resources: ResourceService, list: ListItem[]): ListItem[] {
    for (const item of list) {
      if (item.label) item.label = resources.get(item.label);
      if (item.description) item.description = resources.get(item.description);
    }

    return list;
  }
}
