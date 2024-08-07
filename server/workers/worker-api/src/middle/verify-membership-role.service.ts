import { Context } from '../config';
import { ROLES } from '../models';

export function verifyMembershipRole(role: string): (ctx: Context, next: any) => Promise<Response | void> {
  return async (ctx: Context, next: any): Promise<Response | void> => {
    const { owner, organization } = ctx.req.param();
    //
    //  Check either owner or organization, whichever is present
    //
    const toCheck = owner ?? organization;

    if (!toCheck) return ctx.text('Missing Parameters', 500);

    const memberships = await ctx.var.data.memberships.getAsync(toCheck, ctx.var.idToken.userId);
    const orgRoles = memberships?.roles?.map((x) => x.name) ?? [];

    if (!orgRoles.includes(role)) return ctx.text('Unauthorized', 403);

    await next();
  };
}

export function verifyAdminAsync(): (ctx: Context, next: any) => Promise<Response | void> {
  return verifyMembershipRole(ROLES.ADMIN);
}
