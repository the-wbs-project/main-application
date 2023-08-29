import { Context } from '../config';

export async function verifyMembership(ctx: Context, next: any): Promise<Response | void> {
  const { owner, organization } = ctx.req.param();
  //
  //  Check either owner or organization, whichever is present
  //
  const toCheck = owner ?? organization;
  const userId = ctx.get('userId');

  if (!toCheck) return ctx.text('Missing Parameters', 500);

  const organizations = await ctx.get('data').users.getMembershipsAsync(userId);

  if (!organizations.find((org) => org.id === toCheck || org.name === toCheck)) return ctx.text('Unauthorized', 403);

  await next();
}
