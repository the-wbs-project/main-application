import { Obj } from 'itty-router';
import { AuthenticationService } from './auth-services';

export class WorkerContext {
  params: Obj | undefined;
  query: Obj | undefined;

  constructor(readonly request: Request, readonly auth: AuthenticationService) {}

  get url(): string {
    return this.request.url;
  }
}
