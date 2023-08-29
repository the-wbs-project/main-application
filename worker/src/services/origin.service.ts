import { Context } from '../config';

export class OriginService {
  constructor(private readonly ctx: Context) {}

  async getAsync<T>(suffix?: string): Promise<T> {
    const req = this.ctx.req;
    const res = await this.ctx.get('fetcher').fetch(this.getUrl(suffix), {
      body: req.body,
      headers: req.headers,
      method: req.method,
    });

    if (res.status !== 200) {
      throw new Error(res.statusText);
    }
    return <T>await res.json();
  }

  static async pass(ctx: Context): Promise<Response> {
    const req = ctx.req;
    const res = await ctx.get('fetcher').fetch(req.url, {
      body: req.body,
      headers: req.headers,
      method: req.method,
    });

    return ctx.newResponse(await res.arrayBuffer(), res.status, OriginService.headers(res));
  }

  static headers(res: Response): Record<string, string | string[]> {
    const headers2: Record<string, string | string[]> = {};

    for (const key of res.headers.keys()) {
      headers2[key] = res.headers.get(key)!;
    }

    return headers2;
  }

  async putAsync(suffix: string, body: any): Promise<Response> {
    return await fetch(this.getUrl(suffix), {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.ctx.req.headers.get('Authorization')!,
      },
    });
  }

  async deleteAsync(suffix?: string): Promise<Response> {
    return await fetch(this.getUrl(suffix), {
      method: 'DELETE',
      headers: {
        Authorization: this.ctx.req.headers.get('Authorization')!,
      },
    });
  }

  private getUrl(suffix?: string): string {
    let url = new URL(this.ctx.req.url);

    if (suffix) {
      url = new URL(`${url.protocol}//${url.host}/api/${suffix}`);
    }
    return url.toString();
  }
}
