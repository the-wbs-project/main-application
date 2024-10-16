import { Context } from '../../config';

export class MiscHttpService {
  static async clearKvAsync(ctx: Context): Promise<Response> {
    const kv = ctx.env.KV_DATA;
    const keys = await kv.list();
    let calls: Promise<any>[] = [];

    for (const key of keys.keys) {
      if (key.name.includes('CHAT|')) continue;

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
