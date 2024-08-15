import { Context } from '../../config';
import { OriginService } from '../origin.service';

export class LibraryTaskHttpService {
  static async getPublicAsync(ctx: Context): Promise<Response> {
    try {
      const { owner, entry, version } = ctx.req.param();

      return ctx.json(await ctx.var.data.libraryTasks.getPublicTasksByVersionAsync(owner, entry, parseInt(version)));
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to get a library entry public tasks.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async getInternalAsync(ctx: Context): Promise<Response> {
    try {
      const { owner, entry, version } = ctx.req.param();

      return ctx.json(await ctx.var.data.libraryTasks.getPrivateTasksByVersionAsync(owner, entry, parseInt(version)));
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to get a library entry internal tasks.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async putAsync(ctx: Context): Promise<Response> {
    try {
      const { owner, entry, version } = ctx.req.param();
      const [resp] = await Promise.all([OriginService.pass(ctx), ctx.var.data.libraryTasks.clearKvAsync(owner, entry, parseInt(version))]);

      return resp;
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to save a library entry tasks.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }
}
