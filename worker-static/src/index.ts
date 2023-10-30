import { Hono } from 'hono';
import { Context_Env, Context_Variables } from './context';
import { cors, verify } from './middle';

const app = new Hono<{ Bindings: Context_Env; Variables: Context_Variables }>();

app.use('*', cors);
app.options('*', cors, (c) => c.text(''));

app.get('api/:file', verify, async (cxt) => {
	const { file } = cxt.req.param();

	if (!file) return cxt.text('Missing Parameters', 500);

	const key = decodeURIComponent(file);
	const object = await cxt.env.BUCKET.get(key);

	if (!object) return cxt.text('Not Found', 404);

	const headers = new Headers();
	object.writeHttpMetadata(headers);
	headers.set('etag', object.httpEtag);

	return cxt.newResponse(object.body, {
		headers,
	});
});
app.put('api/:file', verify, async (cxt) => {
	const { file } = cxt.req.param();

	if (!file) return cxt.text('Missing Parameters', 500);

	await cxt.env.BUCKET.put(file, cxt.req.body);

	return cxt.newResponse(null, { status: 204 });
});

export default app;
