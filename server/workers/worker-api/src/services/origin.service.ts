import { StatusCode } from 'hono/utils/http-status';
import { Context } from '../config';

export class OriginService {
  constructor(private readonly ctx: Context) {}

  async getResponseAsync(suffix?: string): Promise<Response | undefined> {
    await this.ctx.var.datadog.flush();

    const res = await this.ctx.get('fetcher').fetch(this.getUrl(suffix), {
      headers: {
        Authorization: this.ctx.req.header('Authorization') ?? '',
      },
      method: 'GET',
    });

    if (res.status === 204) {
      return undefined;
    }
    if (res.status !== 200) {
      throw new Error(res.statusText);
    }
    return res;
  }

  async getTextAsync(suffix?: string): Promise<string | undefined> {
    return (await this.getResponseAsync(suffix))?.text();
  }

  async getAsync<T>(suffix?: string): Promise<T | undefined> {
    return <T>(await this.getResponseAsync(suffix))?.json();
  }

  static async pass(ctx: Context): Promise<Response> {
    const req = ctx.req;
    const url = OriginService.getUrl(ctx.env.ORIGIN, new URL(req.url).pathname);
    const res = await ctx.get('fetcher').fetch(url, {
      body: req.raw.body,
      headers: req.raw.headers,
      method: req.method,
    });

    const body = res.status === 202 || res.status === 204 ? null : await res.arrayBuffer();

    return ctx.newResponse(body, <StatusCode>res.status, OriginService.headers(res));
  }

  static headers(res: Response): Record<string, string | string[]> {
    const headers2: Record<string, string | string[]> = {};

    for (const key of res.headers.keys()) {
      headers2[key] = res.headers.get(key)!;
    }

    return headers2;
  }

  async putAsync(body: any, suffix?: string): Promise<Response> {
    return await fetch(this.getUrl(suffix), {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.ctx.req.raw.headers.get('Authorization')!,
      },
    });
  }

  async postAsync(body: any, suffix?: string): Promise<Response> {
    return await fetch(this.getUrl(suffix), {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.ctx.req.raw.headers.get('Authorization')!,
      },
    });
  }

  async deleteAsync(suffix?: string): Promise<Response> {
    return await fetch(this.getUrl(suffix), {
      method: 'DELETE',
      headers: {
        Authorization: this.ctx.req.raw.headers.get('Authorization')!,
      },
    });
  }

  private static getUrl(origin: string, pathName: string): string {
    const parts = pathName.split('/').filter((x) => x !== '');

    if (parts[0] !== 'api') parts.splice(0, 0, 'api');

    return `${origin}/${parts.join('/')}`;
  }

  private getUrl(pathName?: string): string {
    const suffix = pathName ?? new URL(this.ctx.req.url).pathname;

    return OriginService.getUrl(this.ctx.env.ORIGIN, suffix);
  }
}
