import { Context } from '../config';
import { ROLES } from '../models';

export async function isSiteAdmin(ctx: Context, next: any): Promise<Response | void> {
  const state = ctx.get('state');

  if (!state.roles.find((r) => r.id === ROLES.ADMIN)) return ctx.status(401);

  await next();
}
