import { Context } from '../../config';
import { HttpOriginService } from '../origin-services/http-origin.service';

export class ContentResourceHttpService {
  static async getListAsync(ctx: Context): Promise<Response> {
    try {
      const { owner, parentId } = ctx.req.param();
      const data = await ctx.var.data.contentResources.getListAsync(owner, parentId);
      return new Response(JSON.stringify(data));
    } catch (error) {
      ctx.get('logger').trackException('An error occured trying to get content resources.', <Error>error);

      return ctx.text('Internal Server Error', 500);
    }
  }

  static async getFileAsync(ctx: Context): Promise<Response> {
    try {
      const { owner, parentId, id } = ctx.req.param();
      const data = await ctx.var.data.contentResources.getFileAsync(owner, parentId, id);
      return ctx.newResponse(data);
    } catch (error) {
      ctx.get('logger').trackException('An error occured trying to get content resource file.', <Error>error);
      return ctx.text('Internal Server Error', 500);
    }
  }

  static async putOrDeleteAsync(ctx: Context): Promise<Response> {
    try {
      const { owner, parentId, id } = ctx.req.param();
      const resp = await HttpOriginService.pass(ctx);

      if (resp.status < 300) {
        ctx.executionCtx.waitUntil(ctx.var.data.contentResources.clearKvAsync(owner, parentId));
      }
      return ctx.newResponse(resp.body, {
        status: resp.status,
        statusText: resp.statusText,
        headers: resp.headers,
      });
    } catch (error) {
      ctx.get('logger').trackException('An error occured trying to put or delete content resource.', <Error>error);
      return ctx.text('Internal Server Error', 500);
    }
  }
}
