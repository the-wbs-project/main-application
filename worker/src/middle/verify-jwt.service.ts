import { parseJwt } from '@cfworker/jwt';
import { Context } from '../config';
import { Role } from '../models';

export async function verifyJwt(ctx: Context, next: any): Promise<Response | void> {
  let jwt = ctx.req.headers.get('Authorization');
  const issuer = `https://${ctx.env.AUTH_DOMAIN}/`;
  const audience = ctx.env.AUTH_AUDIENCE;
  const data = ctx.get('data');

  if (!jwt) return ctx.status(403);

  jwt = jwt.replace('Bearer ', '');

  const result = await parseJwt(jwt, issuer, audience);

  if (!result.valid) {
    console.log(result.reason); // Invalid issuer/audience, expired, etc
    return ctx.text(result.reason, 403);
  }
  //
  //  Get the state.  if it doesn't exist set it up.
  //
  let state = await data.authState.getStateAsync(result.payload.sub, jwt);

  if (!state) {
    const id = result.payload.sub;
    const user = await data.auth.getUserAsync(id);

    if (!user) return ctx.text('Cannot find user', 500);

    state = {
      culture: user.userInfo.culture,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      organizationalRoles: {},
      roles: await data.auth.getUserRolesAsync(id),
      organizations: await data.auth.getUserOrganizationsAsync(id),
    };

    for (const org of state.organizations) {
      state.organizationalRoles[org.id] = await data.auth.getUserOrganizationalRolesAsync(id, org.id);
    }

    await ctx.get('data').authState.putStateAsync(result.payload.sub, jwt, state, result.payload.exp);
  }
  ctx.set('state', state);

  await next();
}
