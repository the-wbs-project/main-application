import { Context } from '../context';

const headers = 'authorization,content-type';
const methods = 'GET,POST';

export async function cors(ctx: Context, next: any) {
	try {
		const origin = ctx.req.raw.headers.get('origin');

		if (!origin) return ctx.text('Unauthorized', 403);
		if (!ctx.env.CORS_ORIGINS.includes(origin)) return ctx.text('Unauthorized: ' + origin, 403);

		await next();

		ctx.res.headers.set('Access-Control-Allow-Origin', origin);
		ctx.res.headers.set('Access-Control-Allow-Headers', headers);
		ctx.res.headers.set('Access-Control-Allow-Methods', methods);
	} catch (err: any) {
		console.log(err.message);
		console.log(err.toString());
		return ctx.text(err.message, 500);
	}
}
