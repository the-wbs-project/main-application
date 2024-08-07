import { Context } from '../../config';
import { LibraryEntryViewModel } from '../../view-models';
import { OriginService } from '../origin.service';

export class LibraryEntryHttpService {
  static async getSearchAsync(ctx: Context): Promise<Response> {
    try {
      const resp = await OriginService.pass(ctx);
      const results = await resp.json<{ document: LibraryEntryViewModel }[]>();
      var orgIds: string[] = [];
      const userIds: string[] = [];

      for (const x of results ?? []) {
        const vm = x.document;

        if (!vm.ownerName && !orgIds.includes(vm.ownerId)) {
          orgIds.push(vm.ownerId);
        }
        if (!vm.authorName && !userIds.includes(vm.authorId)) {
          userIds.push(vm.authorId);
        }
      }

      if (orgIds.length === 0 && userIds.length === 0) {
        return ctx.json(results);
      }

      /*const orgs = await Promise.all(orgIds.map((id) => ctx.var.data.organizations.getAsync(id)));
      const users = await Promise.all(userIds.map((id) => ctx.var.data.users.getAsync(id)));

      for (const x of results ?? []) {
        const vm = x.document;

        if (!vm.ownerName) {
          const org = orgs.find((o) => o?.name === vm.ownerId);
          if (org) vm.ownerName = org.display_name;
        }
        if (!vm.authorName) {
          const user = users.find((u) => u?.user_id === vm.authorId);
          if (user) vm.authorName = user.name;
        }
      }*/

      return ctx.json(results);
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to get library entry search results.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }
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

  static async getPublicTasksAsync(ctx: Context): Promise<Response> {
    try {
      const { owner, entry, version } = ctx.req.param();

      return ctx.json(await ctx.var.data.libraryEntries.getPublicTasksByVersionAsync(owner, entry, parseInt(version)));
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to get a library entry public tasks.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async getInternalTasksAsync(ctx: Context): Promise<Response> {
    try {
      const { owner, entry, version } = ctx.req.param();

      return ctx.json(await ctx.var.data.libraryEntries.getPrivateTasksByVersionAsync(owner, entry, parseInt(version)));
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to get a library entry internal tasks.', <Error>e);

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
