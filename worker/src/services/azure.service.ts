import { Context } from '../config';

export class AzureService {
  static async getAsync<T>(ctx: Context, suffix: string): Promise<T> {
    const resp = await fetch(this.prefix(ctx) + suffix, {
      method: 'GET',
      headers: {
        Authorization: ctx.req.headers.get('Authorization')!,
      },
    });

    if (resp.status !== 200) {
      throw new Error(resp.statusText);
    }
    return <T>await resp.json();
  }

  static async putAsync(ctx: Context, suffix: string, body: any): Promise<Response> {
    return await fetch(this.prefix(ctx) + suffix, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        Authorization: ctx.req.headers.get('Authorization')!,
      },
    });
  }

  static async deleteAsync(ctx: Context, suffix: string): Promise<Response> {
    return await fetch(this.prefix(ctx) + suffix, {
      method: 'DELETE',
      headers: {
        Authorization: ctx.req.headers.get('Authorization')!,
      },
    });
  }

  static prefix(ctx: Context): string {
    return `${ctx.env.API_ENDPOINT}/api/`;
  }
}
