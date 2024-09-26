import { Context } from '../../config';

export class AiChatHttpService {
  static async getAsync(ctx: Context): Promise<Response> {
    try {
      const { model } = ctx.req.param();

      return ctx.json(await ctx.get('data').aiChat.getAsync(model));
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to get AI chat history.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async putAsync(ctx: Context): Promise<Response> {
    try {
      const { model } = ctx.req.param();
      const history = await ctx.req.json();

      await ctx.get('data').aiChat.putAsync(model, history);

      return ctx.newResponse(null, 202);
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to save AI chat history.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async deleteAsync(ctx: Context): Promise<Response> {
    try {
      const { model } = ctx.req.param();

      await ctx.get('data').aiChat.deleteAsync(model);

      return ctx.newResponse(null, 202);
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to delete AI chat history.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }
}
