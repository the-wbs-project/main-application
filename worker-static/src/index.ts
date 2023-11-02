import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Context_Env, Context_Variables } from './context';
import { verify } from './middle';
import { Storage } from './storage.service';

const app = new Hono<{ Bindings: Context_Env; Variables: Context_Variables }>();

app.use(
	'*',
	cors({
		origin: ['http://localhost:4200', 'https://test.pm-empower.com', 'https://app.pm-empower.com'],
		allowHeaders: ['Authorization'],
		allowMethods: ['PUT', 'GET', 'OPTIONS'],
		//exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
		maxAge: 600,
		credentials: true,
	})
);
app.options('*', (c) => c.text(''));

app.get('api/:file', verify, async (cxt) => {
	const { file } = cxt.req.param();

	return await Storage.getAsResponseAsync(cxt, file);
});

app.get('api/:owner/:file', verify, async (cxt) => {
	const { file, owner } = cxt.req.param();

	return await Storage.getAsResponseAsync(cxt, file, [owner]);
});

app.put('api/:file', verify, async (cxt) => {
	const { file } = cxt.req.param();

	await Storage.putAsync(cxt, file);

	return cxt.newResponse(null, { status: 204 });
});

app.put('api/:owner/:file', verify, async (cxt) => {
	const { file, owner } = cxt.req.param();

	await Storage.putAsync(cxt, file, [owner]);

	return cxt.newResponse(null, { status: 204 });
});

export default app;
