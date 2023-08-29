import { parseJwt } from '@cfworker/jwt';
import { Context } from '../config';

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
  ctx.set('userId', result.payload.sub);

  await next();
}
