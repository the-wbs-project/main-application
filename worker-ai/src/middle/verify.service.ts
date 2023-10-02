import { parseJwt } from '@cfworker/jwt';
import { Context } from '../context';

export async function verify(ctx: Context, next: any): Promise<Response | void> {
	try {
		let jwt = ctx.req.raw.headers.get('Authorization');
		const issuer = `https://${ctx.env.AUTH_DOMAIN}/`;
		const audience = ctx.env.AUTH_AUDIENCE;

		if (!jwt) return ctx.text('Missing Authorization Header', 403);

		jwt = jwt.replace('Bearer ', '');

		const result = await parseJwt(jwt, issuer, audience);

		if (!result.valid) {
			console.log(result.reason); // Invalid issuer/audience, expired, etc
			return ctx.text(result.reason, 403);
		}
		const userIds = ctx.env.ALLOWED_USERS.split(',');

		if (!userIds.includes(result.payload.sub)) return ctx.text('Unauthorized', 403);

		await next();
	} catch (err: any) {
		console.log(err.message);
		console.log(err.toString());
		return ctx.text(err.message, 500);
	}
}
