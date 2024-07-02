import { Context } from '../../config';

export class LibraryEntryHttpService {
  static async getEntryAsync(ctx: Context): Promise<Response> {
    try {
      const { owner, entry } = ctx.req.param();

      return ctx.json(await ctx.var.data.libraryEntries.getEntryByIdAsync(owner, entry));
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to get a library entry.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async getVersionAsync(ctx: Context): Promise<Response> {
    try {
      const { owner, entry, version } = ctx.req.param();

      return ctx.json(await ctx.var.data.libraryEntries.getVersionByIdAsync(owner, entry, parseInt(version)));
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to get a library entry version.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async getTasksAsync(ctx: Context): Promise<Response> {
    try {
      const { owner, entry, version } = ctx.req.param();

      return ctx.json(await ctx.var.data.libraryEntries.getTasksByVersionAsync(owner, entry, parseInt(version)));
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to get a library entry tasks.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async putEntryAsync(ctx: Context): Promise<Response> {
    try {
      const { owner, entry } = ctx.req.param();
      const body = await ctx.req.json();

      await ctx.var.data.libraryEntries.putEntryAsync(owner, entry, body);

      return ctx.newResponse(null, 204);
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to save a library entry.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async putVersionAsync(ctx: Context): Promise<Response> {
    try {
      const { owner, entry, version } = ctx.req.param();
      const body = await ctx.req.json();

      await ctx.var.data.libraryEntries.putVersionAsync(owner, entry, parseInt(version), body);

      return ctx.newResponse(null, 204);
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to save a library entry version.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async putTasksAsync(ctx: Context): Promise<Response> {
    try {
      const { owner, entry, version } = ctx.req.param();
      const body = await ctx.req.json();

      await ctx.var.data.libraryEntries.putTasksAsync(owner, entry, parseInt(version), body);

      return ctx.newResponse(null, 204);
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to save a library entry tasks.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }
}
