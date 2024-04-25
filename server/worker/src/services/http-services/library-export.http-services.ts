import { Context } from '../../config';
import { OriginService } from '../origin.service';

export class LibraryExportHttpService {
  static async postAsync(ctx: Context): Promise<Response> {
    const { owner } = ctx.req.param();
    const response = await OriginService.pass(ctx);
    const { newId, resourceConversions }: { newId: string; resourceConversions: Record<string, string> } = await response.json();

    for (const [oldId, newId] of Object.entries(resourceConversions)) {
      const file = await ctx.var.data.resourceFiles.getAsResponseAsync(ctx, oldId, [owner]);

      await ctx.var.data.resourceFiles.putAsync(await file.body, newId, [owner]);
    }

    return ctx.json(newId);
  }
}
