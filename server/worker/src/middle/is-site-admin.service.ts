import { Context } from '../config';
import { ROLES } from '../models';

export async function isSiteAdmin(ctx: Context, next: any): Promise<Response | void> {
  const roles = ctx.get('idToken').roles ?? [];

  if (roles.filter((r) => r.id === ROLES.SITE_ADMIN).length === 0) return ctx.status(401);

  await next();
}
