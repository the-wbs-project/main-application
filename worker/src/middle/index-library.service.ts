import { Context } from '../config';

export async function indexLibrary(ctx: Context, next: any) {
  const { owner, entryId } = ctx.req.param();
  await next();
  ctx.executionCtx.waitUntil(ctx.var.data.libraryEntries.indexAsync(owner, entryId));
}
