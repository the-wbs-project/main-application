import { Context } from '../config';
import { ResourceService } from '../services';

const types = ['project_category', 'categories_phase', 'categories_discipline'];

export async function listSetup(ctx: Context, next: any): Promise<Response | void> {
  const { type, locale } = ctx.req.param();

  await next();

  if (!types.includes(type)) return;

  const list: any[] = await ctx.res.json();
  const resourceObj = await ctx.var.data.resources.getAsync(locale);
  const resources = new ResourceService(resourceObj!);

  for (const item of list) {
    if (item.label) item.label = resources.get(item.label);
    if (item.description) item.description = resources.get(item.label);
  }

  return ctx.json(list);
}
