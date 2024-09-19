import { Context } from '../../config';
import { LibraryDraftViewModel } from '../../view-models';
import { OriginService } from '../origin.service';

export class LibraryHttpService {
  static async getIdAsync(ctx: Context): Promise<Response> {
    try {
      const { owner, entry } = ctx.req.param();
      const entryObj = await ctx.var.data.libraryEntries.getByIdAsync(owner, entry);

      return entryObj ? ctx.json(entryObj.id) : ctx.text('Not Found', 404);
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to get a library entry ID from record locator.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async getRecordIdAsync(ctx: Context): Promise<Response> {
    try {
      const { owner, entry } = ctx.req.param();
      const entryObj = await ctx.var.data.libraryEntries.getByIdAsync(owner, entry);

      return entryObj ? ctx.json(entryObj.recordId) : ctx.text('Not Found', 404);
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to get a library entry Record Id from id.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async getDraftsAsync(ctx: Context): Promise<Response> {
    try {
      const resp = await OriginService.pass(ctx);
      const results = (await resp.json<LibraryDraftViewModel[]>()) ?? [];

      await LibraryHttpService.setAuthorNameAsync(results, ctx);

      return ctx.json(results);
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to get library drafts.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  private static async setAuthorNameAsync(list: { authorId: string; authorName: string }[], ctx: Context): Promise<void> {
    const userIds = new Set(list.map((x) => x.authorId));
    const promises = [...userIds].map((id) => ctx.var.data.users.getBasicAsync(id));
    const users = await Promise.all(promises);

    for (const vm of list) {
      const user = users.find((u) => u?.user_id === vm.authorId);

      if (user) {
        vm.authorName = user.name;
      }
    }
  }
}
