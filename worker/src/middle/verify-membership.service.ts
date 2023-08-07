import { Context } from '../config';

export async function verifyMembership(ctx: Context, next: any): Promise<Response | void> {
  console.log('in check');
  const state = ctx.get('state');
  const { owner, organization } = ctx.req.param();
  //
  //  Check either owner or organization, whichever is present
  //
  const toCheck = owner ?? organization;

  if (!toCheck) return ctx.text('Missing Parameters', 500);

  if (!state.organizations.find((org) => org.id === toCheck)) return ctx.text('Unauthorized', 403);

  await next();
}
