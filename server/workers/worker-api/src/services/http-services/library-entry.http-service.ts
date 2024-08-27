import { Context } from '../../config';
import { LibraryEntry } from '../../models';
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
      const resp = await OriginService.pass(ctx);

      await ctx.var.data.libraryEntries.clearKvAsync(owner, entry);

      if (resp.status !== 200) return ctx.text(resp.statusText, resp.status);

      const entryObj: LibraryEntry = await resp.json();

      await ctx.var.data.libraryEntries.clearKvAsync(owner, entryObj.recordId);

      return ctx.json(entryObj);
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to save a library entry.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }
}
