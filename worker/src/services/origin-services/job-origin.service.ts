import { OriginService } from './origin.service';
import { Fetcher } from '../fetcher.service';
import { Env } from '../../config';

export class JobOriginService implements OriginService {
  constructor(private readonly env: Env, private readonly fetcher: Fetcher) {}

  async getResponseAsync(suffix?: string): Promise<Response> {
    return await this.fetcher.fetch(this.getUrl(suffix!), {
      method: 'GET',
      headers: {},
    });
  }

  async getWorkerDataAsync<T>(suffix: string): Promise<T | undefined> {
    const res = await this.fetcher.fetch(this.getUrl(suffix), {
      headers: { 'Worker-Auth': this.env.WORKER_AUTH_KEY },
      method: 'GET',
    });

    if (res.status === 204) {
      return undefined;
    }
    if (res.status !== 200) {
      throw new Error(res.statusText);
    }
    return <T>res.json();
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

  static headers(res: Response): Record<string, string | string[]> {
    const headers2: Record<string, string | string[]> = {};

    for (const key of res.headers.keys()) {
      headers2[key] = res.headers.get(key)!;
    }

    return headers2;
  }

  async putAsync(body: any, suffix?: string): Promise<Response> {
    return await this.fetcher.fetch(this.getUrl(suffix!), {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async postAsync(body: any, suffix?: string): Promise<Response> {
    return await this.fetcher.fetch(this.getUrl(suffix!), {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async deleteAsync(suffix?: string): Promise<Response> {
    return await this.fetcher.fetch(this.getUrl(suffix!), {
      method: 'DELETE',
    });
  }

  private getUrl(pathName: string): string {
    const parts = pathName.split('/').filter((x) => x !== '');

    if (parts[0] !== 'api') parts.splice(0, 0, 'api');

    return `${this.env.ORIGIN}/${parts.join('/')}`;
  }
}
