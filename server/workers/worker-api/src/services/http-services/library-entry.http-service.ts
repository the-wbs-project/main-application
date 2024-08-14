import { Context } from '../../config';
import { OriginService } from '../origin.service';

export class LibraryEntryHttpService {
  static async getAsync(ctx: Context): Promise<Response> {
    try {
      const { owner, entry } = ctx.req.param();

      return ctx.json(await ctx.var.data.libraryEntries.getByIdAsync(owner, entry));
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to get a library entry.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async putAsync(ctx: Context): Promise<Response> {
    try {
      const { owner, entry } = ctx.req.param();
      const [resp] = await Promise.all([OriginService.pass(ctx), ctx.var.data.libraryEntries.clearKvAsync(owner, entry)]);

      return resp;
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to save a library entry.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }
}
