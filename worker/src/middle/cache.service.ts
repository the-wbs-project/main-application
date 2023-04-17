import { Context } from '../config';
import { Cache } from '../services';

export async function cache(ctx: Context, next: any) {
  const perform = ctx.env.DEBUG === 'true';

  if (perform) {
    const match = await Cache.match(ctx);

    if (match) return match;
  }
  await next();

  if (perform && ctx.res.status === 200) {
    Cache.put(ctx);
  }
}
