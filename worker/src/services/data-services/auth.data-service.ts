import { Context } from '../../config';
import { Transformers } from '../transformers';

export class AuthDataService {
  protected readonly transformer = Transformers.users;

  constructor(protected readonly ctx: Context) {}

  async fetch(suffix: string, method: string, body?: any): Promise<Response> {
    const req = this.ctx.req;

    return await this.ctx.get('fetcher').fetch(`${this.ctx.env.AUTH_URL}/api/${suffix}`, {
      body,
      method,
      headers: req.headers,
    });
  }

  protected getStateAsync<T>(parts: string[]): Promise<T | null> {
    return this.ctx.env.KV_AUTH.get<T>(this.key(parts), 'json');
  }

  protected putStateAsync<T>(parts: string[], value: T, expirationTtl: number): void {
    if (value === null) {
      this.deleteStateAsync(parts);
      return;
    }
    const value2 = typeof value === 'string' ? value : typeof value === 'number' ? value.toString() : JSON.stringify(value);

    this.ctx.executionCtx.waitUntil(
      this.ctx.env.KV_AUTH.put(this.key(parts), value2, {
        expirationTtl,
      }),
    );
  }

  protected deleteStateAsync(parts: string[]): void {
    this.ctx.executionCtx.waitUntil(this.ctx.env.KV_AUTH.delete(this.key(parts)));
  }

  private key(parts: string[]): string {
    return parts.map((x) => x.replace('auth0|', '')).join('|');
  }
}
