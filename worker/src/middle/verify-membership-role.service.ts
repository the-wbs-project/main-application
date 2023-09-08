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

    console.log(toCheck);
    console.log(ctx.get('idToken').orgRoles);

    const roles = ctx.get('idToken').orgRoles?.[toCheck] ?? [];

    if (!roles || !roles.includes(role)) return ctx.text('Unauthorized', 403);

    await next();
  };
}

export function verifyAdminAsync(): (ctx: Context, next: any) => Promise<Response | void> {
  return verifyMembershipRole(ROLES.ADMIN);
}
