import { Context } from '../../config';

export class AiChatHttpService {
  static async getAsync(ctx: Context): Promise<Response> {
    try {
      const { model } = ctx.req.param();

      const userId = ctx.var.idToken.userId;
      return ctx.json(await ctx.var.data.aiChat.getAsync(model, userId));
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to get AI chat history.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async putAsync(ctx: Context): Promise<Response> {
    try {
      const { model } = ctx.req.param();
      const history = await ctx.req.json();

      const userId = ctx.var.idToken.userId;
      await ctx.get('data').aiChat.putAsync(model, userId, history);

      return ctx.newResponse(null, 202);
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to save AI chat history.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async deleteAsync(ctx: Context): Promise<Response> {
    try {
      const { model } = ctx.req.param();

      const userId = ctx.var.idToken.userId;
      await ctx.var.data.aiChat.deleteAsync(model, userId);

      return ctx.newResponse(null, 202);
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to delete AI chat history.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }
}
