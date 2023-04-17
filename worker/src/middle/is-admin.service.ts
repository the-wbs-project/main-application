import { Context } from '../config';

export async function isAdmin(ctx: Context, next: any): Promise<Response | void> {
  if ((ctx.get('organization').roles?.indexOf('admin') ?? -1) === -1) return ctx.status(401);

  await next();
}
