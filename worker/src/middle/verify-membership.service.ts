import { Context } from '../config';

export async function verifyMembership(ctx: Context, next: any): Promise<Response | void> {
  const state = ctx.get('state');
  const { owner } = ctx.req.param();

  if (!owner) return ctx.text('Missing Parameters', 500);

  const membership = await ctx.get('data').membership.getAsync(owner, state.user.id);

  if (!membership || !membership.isActive) return ctx.text('Unauthorized', 403);

  ctx.set('membership', membership);

  await next();
}
