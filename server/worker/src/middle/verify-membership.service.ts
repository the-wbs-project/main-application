import { Context } from '../config';

export async function verifyMembership(ctx: Context, next: any): Promise<Response | void> {
  const { owner, organization } = ctx.req.param();
  //
  //  Check either owner or organization, whichever is present
  //
  const toCheck = owner ?? organization;

  if (!toCheck) return ctx.text('Missing Parameters', 500);

  const userId = ctx.var.idToken.userId;
  const memberships = await ctx.var.data.memberships.getMembershipsAsync(userId, false);

  if (!memberships.find((m) => m.id === toCheck || m.name === toCheck)) return ctx.text('Unauthorized', 403);

  await next();
}
