import { Logger } from './logging';

export class Fetcher {
  constructor(private readonly logger: Logger) {}

  async fetch(input: RequestInfo, init?: RequestInit<RequestInitCfProperties>): Promise<Response> {
    let method: string | undefined;
    let url: string | undefined;

    if (typeof input === 'string') {
      method = init?.method ?? 'GET';
      url = input;
    } else if (input instanceof URL) {
      method = init?.method ?? 'GET';
      url = input.toString();
    } else {
      method = input.method;
      url = input.url;
    }
    const start = new Date();
    let end: Date;
    const request = new Request(input, init);
    let response: Response | undefined;

    try {
      response = await fetch(request);
      end = new Date();

      return response;
    } catch (e) {
      console.log(e);
      end = new Date();
      throw e;
    } finally {
      const duration = end!.getTime() - start.getTime();
      this.logger.trackDependency(url, method, duration, request, response);
    }
  }
}
