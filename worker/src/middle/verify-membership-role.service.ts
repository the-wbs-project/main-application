import { Context } from '../config';

export function verifyMembershipRole(role: string): (ctx: Context, next: any) => Promise<Response | void> {
  return async (ctx: Context, next: any): Promise<Response | void> => {
    const { owner, organization } = ctx.req.param();
    const userId = ctx.get('user').id;
    //
    //  Check either owner or organization, whichever is present
    //
    const toCheck = owner ?? organization;

    if (!toCheck) return ctx.text('Missing Parameters', 500);

    const roles = await ctx.get('data').auth.getUserOrganizationalRolesAsync(toCheck, userId);

    if (!roles || !roles.includes(role)) return ctx.text('Unauthorized', 403);

    await next();
  };
}
