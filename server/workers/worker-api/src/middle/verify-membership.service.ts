import { Context } from '../config';

export async function verifyMembership(ctx: Context, next: any): Promise<Response | void> {
  const { owner, organization } = ctx.req.param();
  //
  //  Check either owner or organization, whichever is present
  //
  const toCheck = owner ?? organization;
  const userId = ctx.var.idToken.userId;

  if (!toCheck) return ctx.text('Missing Parameters', 500);

  const membership = await ctx.var.data.users.getViewAsync(toCheck, userId, 'organization');

  if (!membership) return ctx.text('Unauthorized', 403);

  await next();
}
