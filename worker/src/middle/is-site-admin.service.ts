import { Context } from '../config';
import { ROLES } from '../models';

export async function isSiteAdmin(ctx: Context, next: any): Promise<Response | void> {
  const roles = await ctx.get('data').auth.getUserRolesAsync(ctx.get('user').id);

  if (!roles.includes(ROLES.SITE_ADMIN)) return ctx.status(401);

  await next();
}
