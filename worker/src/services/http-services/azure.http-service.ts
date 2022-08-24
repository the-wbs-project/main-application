import { WorkerRequest } from '../worker-request.service';
import { BaseHttpService } from './base.http-service';

export class AzureHttpService extends BaseHttpService {
  static async handleAsync(call: WorkerRequest): Promise<Response | number> {
    const config = call.config.azure;
    const originalUrl = new URL(call.request.url);
    const body = await call.request.arrayBuffer();
    const protocol =
      config.domain.indexOf('localhost') === -1 ? 'https' : 'http';
    const url = `${protocol}://${config.domain}${originalUrl.pathname}`;
    const headers = new Headers(call.request.headers);

    headers.set('app-culture', call.state?.culture ?? '');

    if (config.key) headers.set('x-functions-key', config.key);

    return await call.myFetch(url, {
      body: body,
      method: call.request.method,
      headers,
    });
  }
}
