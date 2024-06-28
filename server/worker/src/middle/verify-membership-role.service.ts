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

    const roles = await ctx.var.data.memberships.getRolesAsync();
    const roleId = roles.find((r) => r.name === role)?.id ?? '';
    const memberships = await ctx.var.data.memberships.getMembershipsAsync(ctx.var.idToken.userId, false);
    const orgRoles = memberships.find((m) => m.id === toCheck)?.roles ?? [];

    if (!orgRoles || !orgRoles.includes(roleId)) return ctx.text('Unauthorized', 403);

    await next();
  };
}

export function verifyAdminAsync(): (ctx: Context, next: any) => Promise<Response | void> {
  return verifyMembershipRole(ROLES.ADMIN);
}
