import { Context } from './context';

export class Storage {
	static async getAsResponseAsync(ctx: Context, fileName: string, folders?: string[]): Promise<Response> {
		fileName = decodeURIComponent(fileName);

		const key = folders ? `${folders.join('/')}/${fileName}` : fileName;
		const object = await ctx.env.BUCKET.get(key);

		if (!object) return ctx.text('Not Found', 404);

		const headers = new Headers();
		object.writeHttpMetadata(headers);
		headers.set('etag', object.httpEtag);

		return ctx.newResponse(object.body, {
			headers,
		});
	}

	static async putAsync(ctx: Context, fileName: string, folders?: string[]): Promise<void> {
		const key = folders ? `${folders.join('/')}/${fileName}` : fileName;

		await ctx.env.BUCKET.put(key, ctx.req.body);
	}
}
