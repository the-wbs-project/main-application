import { WorkerRequest } from '../worker-request.service';

export class BaseHttpService {
  buildJson<T>(json: T): Response {
    return new Response(JSON.stringify(json), {
      status: 200,
      headers: {
        'content-type': 'application/json;charset=utf-8',
      },
    });
  }

  static buildJson<T>(json: T, hdrs: Headers = new Headers()): Response {
    hdrs.set('content-type', 'application/json;charset=utf-8');

    return new Response(JSON.stringify(json), {
      status: 200,
      headers: hdrs,
    });
  }

  static getAuthHeaders(req: WorkerRequest, hdrs: Headers): void {
    hdrs.set('Access-Control-Allow-Origin', 'https://' + req.config.auth.domain);
    hdrs.set('Access-Control-Allow-Methods', 'GET');
  }
}
