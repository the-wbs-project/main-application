import { Hono } from 'hono';
import { Context, Context_Env, Context_Variables } from './context';
import { TEXT_MODELS } from './CONSTS';
import { cors, verify } from './middle';
import { AIService } from './services';

const app = new Hono<{ Bindings: Context_Env; Variables: Context_Variables }>();

app.use('*', async (ctx, next) => {
	ctx.set('ai', new AIService(ctx.env.AI_GATEWAY, ctx.env.OPEN_AI_KEY, ctx.env.AI_REST_TOKEN));

	await next();
});
app.use('*', cors);
app.options('*', (c) => c.text(''));

app.get('api/models/text', verify, (ctx) => ctx.json(TEXT_MODELS));
app.post('api/run/worker-ai', verify, async (ctx: Context) => {
	try {
		const body: { model: string; body: string } = await ctx.req.json();

		return ctx.json(await ctx.var.ai.runWorkerAiAsync(body.model, JSON.stringify(body.body)));
	} catch (err: any) {
		console.log(err.message);
		console.log(err.toString());
		return ctx.text(err.message, 500);
	}
});
app.post('api/run/open-ai', verify, async (ctx: Context) => ctx.json(await ctx.var.ai.runOpenAiAsync(await ctx.req.text())));

app.get('api/logs', verify, async (ctx: Context) => ctx.json(await ctx.env.KV.get('LOGS', 'json')));
app.post('api/logs', verify, async (ctx: Context) => {
	const list = (await ctx.env.KV.get<any[]>('LOGS', 'json')) ?? [];

	list?.push(await ctx.req.json());

	await ctx.env.KV.put('LOGS', JSON.stringify(list));

	return ctx.text('', 204);
});
export default app;
