import { Context } from '../../config';
import { StorageService } from '../data-services/storage.service';

export class MiscHttpService {
  static async handleAzureCallAsync(ctx: Context): Promise<Response> {
    const originalUrl = new URL(ctx.req.url);
    const body = await ctx.req.arrayBuffer();
    const url = `${ctx.env.AZURE_ENDPOINT}/${originalUrl.pathname}`;
    const headers = new Headers(ctx.req.headers);
    const culture = ctx.get('state').culture;

    if (culture) headers.set('app-culture', culture);
    if (ctx.env.AZURE_KEY) headers.set('x-functions-key', ctx.env.AZURE_KEY);

    const res = await ctx.get('fetcher').fetch(url, {
      body: body,
      method: ctx.req.method,
      headers,
    });

    const headers2: Record<string, string | string[]> = {};

    for (const key of res.headers.keys()) {
      headers2[key] = res.headers.get(key)!;
    }

    return ctx.newResponse(await res.arrayBuffer(), res.status, headers2);
  }

  static async getStaticFileAsync(ctx: Context): Promise<Response> {
    const service = new StorageService(ctx.env.BUCKET_STATICS);
    const { file } = ctx.req.param();

    if (!file) return ctx.text('Missing Parameters', 500);

    return service.getAsResponse(ctx, file);
  }

  static async clearKvAsync(ctx: Context): Promise<Response> {
    const kv = ctx.env.KV_DATA;
    const keys = await kv.list();
    let calls: Promise<any>[] = [];

    for (const key of keys.keys) {
      calls.push(kv.delete(key.name));

      if (calls.length === 15) {
        await Promise.all(calls);
        calls = [];
      }
    }
    if (calls.length > 0) await Promise.all(calls);

    return ctx.text('', 204);
  }
}
