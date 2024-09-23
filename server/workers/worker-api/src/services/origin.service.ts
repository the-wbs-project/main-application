import { StatusCode } from 'hono/utils/http-status';
import { Context } from '../config';

export class OriginService {
  constructor(private readonly ctx: Context) {}

  async getResponseAsync(suffix?: string): Promise<Response> {
    await this.ctx.var.datadog.flush();

    return await this.ctx.var.fetcher.fetch(this.getUrl(suffix), {
      headers: {
        Authorization: this.ctx.req.header('Authorization') ?? '',
      },
      method: 'GET',
    });
  }

  async getTextAsync(suffix?: string): Promise<string | undefined> {
    const res = await this.getResponseAsync(suffix);

    if (res.status === 204) {
      return undefined;
    }
    if (res.status !== 200) {
      throw new Error(res.statusText);
    }
    return res.text();
  }

  async getAsync<T>(suffix?: string): Promise<T | undefined> {
    const res = await this.getResponseAsync(suffix);

    if (res.status === 204) {
      return undefined;
    }
    if (res.status !== 200) {
      throw new Error(res.statusText);
    }
    return <T>res.json();
  }

  static async pass(ctx: Context): Promise<Response> {
    const req = ctx.req;
    const method = req.method;
    const url = OriginService.getUrl(ctx.env.ORIGIN, new URL(req.url).pathname);
    const res = await ctx.get('fetcher').fetch(
      url,
      method === 'GET' || method === 'HEAD'
        ? {
            method: method,
            headers: req.raw.headers,
            redirect: req.raw.redirect,
          }
        : {
            method: method,
            headers: req.raw.headers,
            redirect: req.raw.redirect,
            body: req.raw.body,
          },
    );

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
    return await this.ctx.var.fetcher.fetch(this.getUrl(suffix), {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.ctx.req.raw.headers.get('Authorization')!,
      },
    });
  }

  async postAsync(body: any, suffix?: string): Promise<Response> {
    return await this.ctx.var.fetcher.fetch(this.getUrl(suffix), {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.ctx.req.raw.headers.get('Authorization')!,
      },
    });
  }

  async deleteAsync(suffix?: string): Promise<Response> {
    return await this.ctx.var.fetcher.fetch(this.getUrl(suffix), {
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
