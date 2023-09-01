import { Context } from '../config';

export function kvPurge(prefix: string): (ctx: Context, next: any) => Promise<Response | void> {
  return async (ctx: Context, next: any): Promise<Response | void> => {
    await next();

    if (ctx.res.status > 204) return;

    const list = await ctx.env.KV_DATA.list({ prefix });

    for (const item of list.keys) {
      await ctx.env.KV_DATA.delete(item.name);
    }
  };
}
