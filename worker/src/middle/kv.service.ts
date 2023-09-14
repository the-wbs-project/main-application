import { Context } from '../config';

export const kv = {
  checklists,
  lists,
  members,
  resources,
  roles,
  users,
};

function resources(ctx: Context, next: any): Promise<Response | void> {
  return execute(ctx, next, 'RESOURCES|:locale');
}

function roles(ctx: Context, next: any): Promise<Response | void> {
  return execute(ctx, next, 'ROLES');
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

function members(ctx: Context, next: any): Promise<Response | void> {
  return execute(ctx, next, 'ORGS|:organization|MEMBERS', 15 * 60);
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

  //
  //  If we aren't forcing a refresh, check the KV store first
  //
  if (ctx.req.headers.get('force-refresh') !== 'true') {
    const kvData = await ctx.env.KV_DATA.get(key, 'json');

    if (kvData) return ctx.json(kvData);
  }
  await next();

  if (ctx.res.status !== 200) return;

  const clone = ctx.res.clone();
  const text = await clone.text();

  await ctx.env.KV_DATA.put(key, text, {
    expirationTtl: expirationInSeconds,
  });
}
