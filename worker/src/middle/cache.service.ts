import { Context } from '../config';
import { Cache } from '../services';

export async function cache(ctx: Context, next: any) {
  const perform = true; // ctx.env.DEBUG === 'false';

  if (perform) {
    const match = await Cache.match(ctx);

    if (match) return match;
  }
  await next();

  if (!perform || ctx.res.status !== 200) return;

  //ctx.res.body?.tee();

  const body = await ctx.res.clone().text();
  const headers = new Headers(ctx.res.headers);

  Cache.put(ctx, new Response(body, { status: ctx.res.status, headers }));

  console.log('Sending response after cache put');
  //return ctx.json(body);
  return ctx.newResponse(body, { status: ctx.res.status, headers });
}
