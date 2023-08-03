import { parseJwt } from '@cfworker/jwt';
import { Context } from '../config';
import { IdentityService } from '../services';

export async function verifyJwt(ctx: Context, next: any): Promise<Response | void> {
  let jwt = ctx.req.headers.get('Authorization');
  const issuer = `https://${ctx.env.AUTH_DOMAIN}/`;
  const audience = ctx.env.AUTH_AUDIENCE;

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
  let state = await ctx.get('data').auth.getStateAsync(result.payload.sub, jwt);

  if (!state) {
    const user = await IdentityService.getUserAsync(ctx, result.payload.sub);

    if (!user) return ctx.text('Cannot find user', 500);

    state = {
      culture: user.userInfo.culture,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };

    await ctx.get('data').auth.putStateAsync(result.payload.sub, jwt, state, result.payload.exp);
  }
  ctx.set('state', state);

  await next();
}
