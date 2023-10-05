import { Context } from '../../config';
import { StorageService } from '../data-services/storage.service';

export class MiscHttpService {
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

    return ctx.newResponse(null, { status: 204 });
  }
}
