import { Context } from '../config';

export function kv(key: string): (ctx: Context, next: any) => Promise<Response | void> {
  return async (ctx: Context, next: any): Promise<Response | void> => {
    //
    //  First we need to replace any param values in key with the actual
    //
    const params = ctx.req.param();

    for (const param of Object.keys(params)) {
      if (key.includes(':' + param)) {
        key = key.replace(':' + param, params[param]);
      }
    }

    const kvData = await ctx.env.KV_DATA.get(key, 'json');

    if (kvData) return ctx.json(kvData);

    console.log('KV ' + key + ' not found');

    await next();

    const clone = ctx.res.clone();
    const text = await clone.text();

    await ctx.env.KV_DATA.put(key, text);
  };
}
