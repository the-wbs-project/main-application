import { Context } from '../config';
import { ROLES } from '../models';

export async function isSiteAdmin(ctx: Context, next: any): Promise<Response | void> {
  const userId = ctx.var.idToken.userId;
  const roles = await ctx.var.data.users.getSiteRolesAsync(userId);

  if (roles.every((r) => r.name !== ROLES.SITE_ADMIN)) return ctx.status(401);

  await next();
}
