import { Context } from '../../config';

export class ResourceFileHttpService {
  static async getAsync(ctx: Context): Promise<Response> {
    const { file, owner } = ctx.req.param();

    return ctx.var.data.resourceFiles.getAsResponseAsync(ctx, file, [owner]);
  }

  static async putAsync(ctx: Context): Promise<Response> {
    const { file, owner } = ctx.req.param();
    const req = ctx.req.raw.clone();

    await ctx.var.data.resourceFiles.putAsync(req.body, file, [owner]);

    return ctx.newResponse(null, { status: 204 });
  }
}
