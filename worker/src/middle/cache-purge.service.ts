import { Context } from '../config';
import { Cache } from '../services';

export async function cachePurge(ctx: Context, next: any) {
  await next();
  Cache.delete(ctx);
}
