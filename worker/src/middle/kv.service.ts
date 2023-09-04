import { Context } from '../config';

export const kv = {
  resources,
  lists,
  checklists,
  users,
};

function resources(ctx: Context, next: any): Promise<Response | void> {
  return execute(ctx, next, 'RESOURCES|:locale');
}

function lists(ctx: Context, next: any): Promise<Response | void> {
  return execute(ctx, next, 'LISTS|:type');
}

function checklists(ctx: Context, next: any): Promise<Response | void> {
  return execute(ctx, next, 'CHECKLISTS');
}

function users(ctx: Context, next: any): Promise<Response | void> {
  return execute(ctx, next, 'USERS|:user|PROFILE', 60 * 60);
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

async function execute(ctx: Context, next: any, key: string, expirationInSeconds?: number): Promise<Response | void> {
  key = createKey(ctx, key);

  const kvData = await ctx.env.KV_DATA.get(key, 'json');

  if (kvData) return ctx.json(kvData);

  console.log('KV ' + key + ' not found');

  await next();

  const clone = ctx.res.clone();
  const text = await clone.text();

  await ctx.env.KV_DATA.put(key, text, {
    expirationTtl: expirationInSeconds,
  });
}
