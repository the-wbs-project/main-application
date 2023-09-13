import { Context } from '../config';

export async function kvPurgeOrgs(ctx: Context, next: any): Promise<Response | void> {
  await next();

  if (ctx.res.status > 204) return;

  for (const org of ctx.get('idToken').organizations) {
    await ctx.env.KV_DATA.delete(`ORGS|${org.name}|members`);
  }
}

export function kvPurge(prefix: string): (ctx: Context, next: any) => Promise<Response | void> {
  return async (ctx: Context, next: any): Promise<Response | void> => {
    await next();

    if (ctx.res.status > 204) return;

    const list = await ctx.env.KV_DATA.list({ prefix: createKey(ctx, prefix) });

    for (const item of list.keys) {
      await ctx.env.KV_DATA.delete(item.name);
    }
  };
}

function createKey(ctx: Context, key: string): string {
  const params = ctx.req.param();

  for (const param of Object.keys(params)) {
    if (key.includes(':' + param)) {
      key = key.replace(':' + param, params[param]);
    }
  }
  return key.replace('auth0|', '');
}
