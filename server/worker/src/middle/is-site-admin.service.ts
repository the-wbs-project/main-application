import { Context } from '../config';
import { ROLES } from '../models';

export async function isSiteAdmin(ctx: Context, next: any): Promise<Response | void> {
  const roles = await ctx.var.data.memberships.getRolesAsync();

  if (roles.every((r) => r.name !== ROLES.SITE_ADMIN)) return ctx.status(401);

  await next();
}
