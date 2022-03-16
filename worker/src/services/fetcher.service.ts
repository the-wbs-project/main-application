import { Logger } from './logger.service';

export class Fetcher {
  constructor(protected readonly logger: Logger) {}

  async fetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
    const method =
      (typeof input === 'string' ? init?.method : input.method) ??
      'GET';
    const url = typeof input === 'string' ? input : input.url;
    const start = new Date();
    let response: Response | null = null;

    try {
      response = await fetch(input, init);
      return response;
    } finally {
      const duration = (new Date().getTime() - start.getTime()) * 1000;
      this.logger.trackDependency(url, method, duration, response);
    }
  }
}
