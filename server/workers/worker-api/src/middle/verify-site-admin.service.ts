import { Context } from '../config';
import { ROLES } from '../models';

export async function verifySiteAdmin(ctx: Context, next: any): Promise<Response | void> {
  const userId = ctx.var.userId;
  const roles = await ctx.var.data.users.getSiteRolesAsync(userId);

  if (roles.every((r) => r.name !== ROLES.SITE_ADMIN)) return ctx.newResponse('Unauthorized', 401);

  await next();
}
