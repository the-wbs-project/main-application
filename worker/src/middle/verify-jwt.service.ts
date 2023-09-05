import { parseJwt } from '@cfworker/jwt';
import { Context } from '../config';

export async function verifyJwt(ctx: Context, next: any): Promise<Response | void> {
  let jwt = ctx.req.headers.get('Authorization');
  const issuer = `https://${ctx.env.AUTH_DOMAIN}/`;
  const audience = ctx.env.AUTH_AUDIENCE;

  if (!jwt) return ctx.text('Missing Authorization Header', 403);

  jwt = jwt.replace('Bearer ', '');

  const result = await parseJwt(jwt, issuer, audience);

  if (!result.valid) {
    console.log(result.reason); // Invalid issuer/audience, expired, etc
    return ctx.text(result.reason, 403);
  }
  ctx.set('idToken', {
    userId: result.payload.sub,
    //@ts-ignore
    roles: result.payload['http://www.pm-empower.com/roles'],
    //@ts-ignore
    organizations: result.payload['http://www.pm-empower.com/organizations'],
    //@ts-ignore
    orgRoles: result.payload['http://www.pm-empower.com/organizations-roles'],
  });

  await next();
}
