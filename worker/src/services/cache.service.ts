import { Context } from '../config';

const cache = caches.default;

export class Cache {
  static match(ctx: Context): Promise<Response | undefined> {
    return cache.match(this.req(ctx));
  }

  static put(ctx: Context, res: Response): void {
    ctx.executionCtx.waitUntil(cache.put(this.req(ctx), res));
  }

  static delete(ctx: Context): void {
    ctx.executionCtx.waitUntil(
      cache.delete(this.req(ctx), {
        ignoreMethod: true,
      }),
    );
  }

  private static req(ctx: Context): Request {
    return new Request(ctx.req.url, {
      method: ctx.req.method,
    });
  }
}
