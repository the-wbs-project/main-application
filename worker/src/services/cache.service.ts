import { Context } from '../config';

const cache = caches.default;

export class Cache {
  static match(ctx: Context): Promise<Response | undefined> {
    return cache.match(this.req(ctx));
  }

  static put(ctx: Context): void {
    ctx.executionCtx.waitUntil(cache.put(this.req(ctx), ctx.res.clone()));
  }

  private static req(ctx: Context): Request {
    return new Request(ctx.req.url, {
      method: ctx.req.method,
    });
  }
}
