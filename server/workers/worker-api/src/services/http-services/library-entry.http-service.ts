import { Context } from '../../config';
import { UserViewModel } from '../../view-models';
import { HttpOriginService } from '../origin-services/http-origin.service';
import { Transformers } from '../transformers';

export class LibraryEntryHttpService {
  static async getIdAsync(ctx: Context): Promise<Response> {
    try {
      const { owner, entry } = ctx.req.param();
      const obj = await ctx.var.data.libraryEntries.getByIdAsync(owner, entry);

      return obj ? ctx.json(obj.id) : ctx.text('Not Found', 404);
    } catch (e) {
      ctx.var.logger.trackException('An error occured trying to get a library entry ID from record locator.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async getRecordIdAsync(ctx: Context): Promise<Response> {
    try {
      const { owner, entry } = ctx.req.param();
      const obj = await ctx.var.data.libraryEntries.getByIdAsync(owner, entry);

      return obj ? ctx.json(obj.recordId) : ctx.text('Not Found', 404);
    } catch (e) {
      ctx.var.logger.trackException('An error occured trying to get a library entry record ID.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async getVersionByIdAsync(ctx: Context): Promise<Response> {
    try {
      const { owner, entry, version, visibility } = ctx.req.param();

      const version2 = parseInt(version);

      const [entryObj, versions, versionObj, tasks, isMember, orgObj] = await Promise.all([
        ctx.var.data.libraryEntries.getByIdAsync(owner, entry),
        ctx.var.data.libraryVersions.getAsync(owner, entry),
        ctx.var.data.libraryVersions.getByIdAsync(owner, entry, version2),
        ctx.var.data.libraryTasks.getAsync(owner, entry, version2, visibility),
        ctx.var.data.users.isMemberAsync(owner, ctx.var.idToken.userId),
        ctx.var.data.organizations.getByNameAsync(owner),
      ]);

      if (!entryObj || !versionObj) return ctx.text('Not Found', 404);

      const userId = ctx.var.idToken.userId;
      const claims = await ctx.var.claims.getForLibraryEntry(owner, userId, owner, versionObj);
      //
      //  Now get users
      //
      const vis = isMember ? 'organization' : 'public';
      const userCalls: Promise<UserViewModel | undefined>[] = [ctx.var.data.users.getViewAsync(owner, versionObj.author, vis)];

      for (const id of versionObj.editors ?? []) {
        userCalls.push(ctx.var.data.users.getViewAsync(owner, id, vis));
      }

      var users = (await Promise.all(userCalls)).filter((u) => u !== undefined);

      return ctx.json({
        versions,
        version: Transformers.libraryVersion.toViewModel(entryObj, versionObj, orgObj!, users),
        tasks,
        claims,
      });
    } catch (e) {
      ctx.var.logger.trackException('An error occured trying to get a library entry.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async putEntryAsync(ctx: Context): Promise<Response> {
    try {
      const { owner, entry } = ctx.req.param();
      const resp = await HttpOriginService.pass(ctx);
      const exec = ctx.executionCtx;

      if (resp.status < 300) {
        exec.waitUntil(ctx.var.data.libraryEntries.refreshKvAsync(owner, entry));
      }

      return ctx.newResponse(resp.body, {
        status: resp.status,
        statusText: resp.statusText,
        headers: resp.headers,
      });
    } catch (e) {
      ctx.var.logger.trackException('An error occured trying to save a library entry.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async putVersionAsync(ctx: Context): Promise<Response> {
    try {
      const { owner, entry } = ctx.req.param();
      const resp = await HttpOriginService.pass(ctx);
      const exec = ctx.executionCtx;

      if (resp.status < 300) {
        await Promise.all([
          ctx.var.data.libraryEntries.refreshKvAsync(owner, entry),
          ctx.var.data.libraryVersions.refreshKvAsync(owner, entry),
        ]);
      }

      return ctx.newResponse(resp.body, {
        status: resp.status,
        statusText: resp.statusText,
        headers: resp.headers,
      });
    } catch (e) {
      ctx.var.logger.trackException('An error occured trying to save a library entry version.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async putTasksAsync(ctx: Context): Promise<Response> {
    try {
      const { owner, entry, version } = ctx.req.param();
      const version2 = parseInt(version);
      const resp = await HttpOriginService.pass(ctx);
      const exec = ctx.executionCtx;

      if (resp.status < 300) {
        exec.waitUntil(ctx.var.data.libraryEntries.refreshKvAsync(owner, entry));
        exec.waitUntil(ctx.var.data.libraryVersions.refreshKvAsync(owner, entry));
        exec.waitUntil(ctx.var.data.libraryTasks.refreshKvAsync(owner, entry, version2));
      }

      return ctx.newResponse(resp.body, {
        status: resp.status,
        statusText: resp.statusText,
        headers: resp.headers,
      });
    } catch (e) {
      ctx.var.logger.trackException('An error occured trying to save library entry tasks.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }
}
