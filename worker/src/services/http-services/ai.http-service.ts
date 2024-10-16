import { Context } from '../../config';
import { AI_MODELS } from '../../models';

export class AiHttpService {
  static async getModelsAsync(ctx: Context): Promise<Response> {
    try {
      return ctx.json(AI_MODELS);
    } catch (e) {
      ctx.var.logger.trackException('An error occured trying to get AI models.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async runWorkerAiAsync(ctx: Context): Promise<Response> {
    try {
      const body: { model: string; body: string } = await ctx.req.json();

      return ctx.json(await ctx.var.ai.runWorkerAiAsync(body.model, JSON.stringify(body.body)));
    } catch (err: any) {
      ctx.var.logger.trackException('An error occured trying to run worker ai.', <Error>err);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async runOpenAiAsync(ctx: Context): Promise<Response> {
    try {
      const body = await ctx.req.text();

      return ctx.json(await ctx.var.ai.runOpenAiAsync(body));
    } catch (err: any) {
      ctx.var.logger.trackException('An error occured trying to run OpenAi.', <Error>err);

      return ctx.text('Internal Server Error', 500);
    }
  }
}
