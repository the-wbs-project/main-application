import { Context } from '../config';

export async function isAdmin(ctx: Context, next: any): Promise<Response | void> {
  const roles = ctx.get('membership')?.roles ?? [];

  if (roles.indexOf('admin') === -1) return ctx.status(401);

  await next();
}
