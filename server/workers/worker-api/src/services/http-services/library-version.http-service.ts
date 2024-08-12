import { Context } from '../../config';
import { UserViewModel } from '../../view-models';
import { Transformers } from '../transformers';

export class LibraryVersionHttpService {
  static async getAsync(ctx: Context): Promise<Response> {
    try {
      const { owner, entry } = ctx.req.param();
      const versions = await ctx.var.data.libraryVersions.getAsync(owner, entry);

      return ctx.json(versions.map((v) => Transformers.libraryVersion.toBasic(v)));
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to get a library entry versions.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async getByIdAsync(ctx: Context): Promise<Response> {
    try {
      const { owner, entry, version } = ctx.req.param();
      const [entryObj, versionObj, isMember, orgObj] = await Promise.all([
        ctx.var.data.libraryEntries.getByIdAsync(owner, entry),
        ctx.var.data.libraryVersions.getByIdAsync(owner, entry, parseInt(version)),
        ctx.var.data.users.isMemberAsync(owner, ctx.var.idToken.userId),
        ctx.var.data.organizations.getByNameAsync(owner),
      ]);

      if (!entryObj || !versionObj) return ctx.text('Not Found', 404);
      //
      //  Now get users
      //
      const vis = isMember ? 'organization' : 'public';
      const userCalls: Promise<UserViewModel | undefined>[] = [ctx.var.data.users.getViewAsync(owner, versionObj.author, vis)];

      for (const id of versionObj.editors ?? []) {
        userCalls.push(ctx.var.data.users.getViewAsync(owner, id, vis));
      }

      var users = (await Promise.all(userCalls)).filter((u) => u !== undefined);

      return ctx.json(Transformers.libraryVersion.toViewModel(entryObj, versionObj, orgObj!, users));
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to get a library entry version.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async putAsync(ctx: Context): Promise<Response> {
    try {
      const { owner, entry, version } = ctx.req.param();
      const body = await ctx.req.json();

      await ctx.var.data.libraryVersions.putAsync(owner, entry, parseInt(version), body);

      return ctx.newResponse(null, 204);
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to save a library entry version.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async publishAsync(ctx: Context): Promise<Response> {
    try {
      const { owner, entry, version } = ctx.req.param();
      const body = await ctx.req.json();

      await ctx.var.data.libraryVersions.publishAsync(owner, entry, parseInt(version), body);

      return ctx.newResponse(null, 204);
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to publish a library entry version.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }
}
