import { Context } from '../config';

export const kv = {
  checklists,
  resourceFile,
  resourceFileClear,
};

function checklists(ctx: Context, next: any): Promise<Response | void> {
  return execute(ctx, next, 'CHECKLISTS');
}

function resourceFile(ctx: Context, next: any): Promise<Response | void> {
  const { resource } = ctx.req.param();

  return executeBytes(ctx, next, 'RESOURCE-FILE|' + resource);
}

function resourceFileClear(ctx: Context, next: any): Promise<Response | void> {
  const { resource } = ctx.req.param();

  return clear(ctx, next, 'RESOURCE-FILE|' + resource);
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

async function execute(
  ctx: Context,
  next: any,
  key: string,
  expirationInSeconds?: number,
  dataVerification?: (data: any) => boolean,
): Promise<Response | void> {
  key = createKey(ctx, key);

  //
  //  If we aren't forcing a refresh, check the KV store first
  //
  if (ctx.req.raw.headers.get('cache-control') !== 'no-cache') {
    const kvData = await ctx.env.KV_DATA.get(key, 'json');

    if (kvData) {
      if (dataVerification == undefined) return ctx.json(kvData);
      if (dataVerification(kvData)) return ctx.json(kvData);
    }
  }
  await next();

  if (ctx.res.status !== 200) return;

  const text = await ctx.res.clone().text();
  const headers = new Headers(ctx.res.headers);

  await ctx.env.KV_DATA.put(key, text, {
    expirationTtl: expirationInSeconds,
  });

  return ctx.newResponse(text, { status: ctx.res.status, headers });
}

async function executeBytes(ctx: Context, next: any, key: string, expirationInSeconds?: number): Promise<Response | void> {
  key = createKey(ctx, key);

  //
  //  If we aren't forcing a refresh, check the KV store first
  //
  if (ctx.req.raw.headers.get('cache-control') !== 'no-cache') {
    const kvData = await ctx.env.KV_DATA.get(key, 'arrayBuffer');

    if (kvData) {
      return ctx.newResponse(kvData, { status: 200 });
    }
  }
  await next();

  if (ctx.res.status !== 200) return;

  const arrayBuffer = await ctx.res.clone().arrayBuffer();
  const headers = new Headers(ctx.res.headers);

  await ctx.env.KV_DATA.put(key, arrayBuffer, {
    expirationTtl: expirationInSeconds,
  });

  return ctx.newResponse(arrayBuffer, { status: ctx.res.status, headers });
}

async function clear(ctx: Context, next: any, key: string): Promise<Response | void> {
  key = createKey(ctx, key);

  await ctx.env.KV_DATA.delete(key);

  await next();
}
