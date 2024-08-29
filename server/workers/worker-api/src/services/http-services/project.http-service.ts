import { Context } from '../../config';
import { Member } from '../../models';
import { UserViewModel } from '../../view-models';
import { OriginService } from '../origin.service';
import { Transformers } from '../transformers';

export class ProjectHttpService {
  static async getByOwnerAsync(ctx: Context): Promise<Response> {
    try {
      const { owner } = ctx.req.param();

      return ctx.json(await ctx.var.data.projects.getByOwnerAsync(owner));
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to get projects.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async getByIdAsync(ctx: Context): Promise<Response> {
    try {
      const { owner, project } = ctx.req.param();
      const projectObj = await ctx.var.data.projects.getByIdAsync(owner, project);

      if (!projectObj) return ctx.text('Not Found', 404);
      //
      //  Now get users
      //
      const userIds = [...new Set((projectObj.roles ?? []).map((r) => r.userId))];

      const userCalls = userIds.map((id) => ctx.var.data.users.getViewAsync(owner, id, 'organization'));

      var users = (await Promise.all(userCalls)).filter((u) => u !== undefined);

      return ctx.json(Transformers.project.toViewModel(projectObj, users));
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to get project by id.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async putAsync(ctx: Context): Promise<Response> {
    try {
      const { owner, project } = ctx.req.param();
      const [resp] = await Promise.all([OriginService.pass(ctx), ctx.var.data.projects.clearKvAsync(owner, project)]);

      return resp;
    } catch (e) {
      ctx.get('logger').trackException('An error occured trying to save a library entry version.', <Error>e);

      return ctx.text('Internal Server Error', 500);
    }
  }
}
