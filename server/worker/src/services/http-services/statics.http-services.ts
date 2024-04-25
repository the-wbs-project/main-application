import { Context } from '../../config';

export class StaticsHttpService {
  static async getAsync(ctx: Context): Promise<Response> {
    const { file } = ctx.req.param();

    return ctx.var.data.resourceFiles.getAsResponseAsync(ctx, file);
  }
}
