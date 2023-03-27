import { WorkerRequest } from '../worker-request.service';
import { BaseHttpService } from './base.http-service';

export class AzureHttpService extends BaseHttpService {
  static async handleAsync(req: WorkerRequest): Promise<Response | number> {
    const config = req.context.config.azure;
    const originalUrl = new URL(req.request.url);
    const body = await req.request.arrayBuffer();
    const protocol = config.domain.indexOf('localhost') === -1 ? 'https' : 'http';
    const url = `${protocol}://${config.domain}${originalUrl.pathname}`;
    const headers = new Headers(req.request.headers);

    headers.set('app-culture', req.context.state?.culture ?? '');

    if (config.key) headers.set('x-functions-key', config.key);

    return await req.myFetch(url, {
      body: body,
      method: req.request.method,
      headers,
    });
  }
}
