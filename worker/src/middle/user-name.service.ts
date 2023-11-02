import { Context } from '../config';

export function userName(property: string): (ctx: Context, next: any) => Promise<Response | void> {
  return async (ctx: Context, next: any): Promise<Response | void> => {
    await next();

    if (ctx.res.status !== 200) return;

    const list: Record<string, any>[] = await ctx.res.json();
    const headers = new Headers(ctx.res.headers);
    const names = new Map<string, string>();

    for (const item of list) {
      const value = item[property];

      if (value && typeof value === 'string' && !names.has(value)) {
        const user = await ctx.get('data').user.getAsync(value);

        if (user) names.set(value, user.name);
      }
      item[property] = names.get(value)!;
    }

    return ctx.newResponse(JSON.stringify(list), {
      status: 200,
      headers,
    });
  };
}
