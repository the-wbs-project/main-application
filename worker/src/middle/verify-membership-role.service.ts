import { Context } from '../config';
import { ROLES } from '../models';

export async function verifyAdminAsync(ctx: Context, next: any): Promise<Response | void> {
  const { owner, organization } = ctx.req.param();
  //
  //  Check either owner or organization, whichever is present
  //
  const toCheck = owner ?? organization;

  if (!toCheck) return ctx.text('Missing Parameters', 500);

  const userId = ctx.var.userId;
  const roles = await ctx.var.data.members.getRolesAsync(organization, userId);

  if (!roles.includes(ROLES.ADMIN)) return ctx.text('Unauthorized', 403);

  await next();
}
