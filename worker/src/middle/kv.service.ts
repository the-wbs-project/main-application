import { Context } from '../config';

export const kv = {
  resources,
  lists,
  checklists,
  members,
  memberships,
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

function members(ctx: Context, next: any): Promise<Response | void> {
  return execute(ctx, next, 'ORGS|:organization|MEMBERS', 10 * 60);
}

function memberships(ctx: Context, next: any): Promise<Response | void> {
  return execute(ctx, next, 'USERS|:user|MEMBERSHIPS', 30 * 60);
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
