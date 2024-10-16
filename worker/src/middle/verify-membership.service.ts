import { Context } from '../config';

export async function verifyMembership(ctx: Context, next: any): Promise<Response | void> {
  const { owner, organization } = ctx.req.param();
  //
  //  Check either owner or organization, whichever is present
  //
  const toCheck = owner ?? organization;
  const userId = ctx.var.userId;

  if (!toCheck) return ctx.text('Missing Parameters', 500);

  const isMember = await ctx.var.data.members.isMemberAsync(toCheck, userId);

  if (!isMember) return ctx.text('Unauthorized', 403);

  await next();
}
