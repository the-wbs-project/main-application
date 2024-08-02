import { Context } from '../config';
import { ROLES } from '../models';

export function verifyMembershipRole(role: string): (ctx: Context, next: any) => Promise<Response | void> {
  return async (ctx: Context, next: any): Promise<Response | void> => {
    const { organization } = ctx.req.param();
    const userId = ctx.var.idToken.userId;
    const orgId = await ctx.var.data.organizations.getIdFromNameAsync(organization);

    if (!orgId) return ctx.text('Organization Not Found', 400);

    const membership = await ctx.var.data.memberships.getAsync(userId, orgId);

    if (!membership) return ctx.text('Unauthorized', 403);

    if (!membership.roles.some((x) => x.name === role)) return ctx.text('Unauthorized', 403);

    await next();
  };
}

export function verifyAdmin(): (ctx: Context, next: any) => Promise<Response | void> {
  return verifyMembershipRole(ROLES.ADMIN);
}
