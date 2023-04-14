import { Obj } from 'itty-router';
import { WorkerContext } from './worker-context.service';

export class WorkerRequest {
  params: Obj | undefined;
  query: Obj | undefined;

  constructor(readonly request: Request, readonly context: WorkerContext) {}

  get headers(): Headers {
    return this.request.headers;
  }

  get method(): string {
    return this.request.method;
  }

  get url(): string {
    return this.request.url;
  }

  myFetch(input: string | Request, init?: RequestInit): Promise<Response> {
    return this.context.myFetch(this.request, input, init);
  }
}
