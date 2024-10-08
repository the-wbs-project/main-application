import { Context } from '../config';

export async function verifyMyself(ctx: Context, next: any): Promise<Response | void> {
  const { user } = ctx.req.param();

  if (!user) return ctx.text('Missing Parameters', 500);

  if (ctx.var.userId !== user) return ctx.text('Unauthorized', 403);

  await next();
}
