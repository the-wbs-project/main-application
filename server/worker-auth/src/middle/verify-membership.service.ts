import { Context } from '../config';

export async function verifyMembership(ctx: Context, next: any): Promise<Response | void> {
  const { organization } = ctx.req.param();
  const userId = ctx.var.idToken.userId;
  const memberships = await ctx.var.data.users.getMembershipsAsync(userId);

  if (!memberships.some((m) => m.name === organization)) return ctx.text('Unauthorized', 403);

  await next();
}
