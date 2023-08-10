import { parseJwt } from '@cfworker/jwt';
import { Context } from '../config';

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
  //  Set the user information (mostly for logging)
  //
  const user = await data.auth.getUserAsync(result.payload.sub);

  ctx.set('user', {
    id: user.id,
    name: user.name,
    email: user.email,
  });

  /*
  //
  //  Get the state.  if it doesn't exist set it up.
  //
  let state = await data.authState.getStateAsync(result.payload.sub, jwt);

  console.log(result);
  if (!state) {
    const id = result.payload.sub;
    const user = await data.auth.getUserAsync(id);

    if (!user) return ctx.text('Cannot find user', 500);

    const [roles, organizations] = await Promise.all([data.auth.getUserRolesAsync(id), data.auth.getUserOrganizationsAsync(id)]);

    state = {
      culture: user.userInfo.culture,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      organizationalRoles: {},
      roles,
      organizations,
    };

    for (const org of state.organizations) {
      state.organizationalRoles[org.id] = await data.auth.getUserOrganizationalRolesAsync(org.id, id);
    }

    await ctx.get('data').authState.putStateAsync(result.payload.sub, jwt, state, result.payload.exp);
  }
  ctx.set('state', state);*/

  await next();
}
