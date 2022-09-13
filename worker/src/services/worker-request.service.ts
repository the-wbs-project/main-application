import { Obj } from 'itty-router';
import { Config } from '../config';
import { AuthState, OrganizationRoles } from '../models';
import { ServiceFactory } from './factory.service';
import { myFetch } from './fetcher.service';
import { Logger } from './logger.service';

export class WorkerRequest {
  private _request: Request;
  private _state?: AuthState;
  private _organization?: OrganizationRoles;
  isAuthenticated?: boolean;
  params: Obj | undefined;
  query: Obj | undefined;
  //token: TokenInfo | undefined;

  constructor(request: Request, readonly config: Config, readonly services: ServiceFactory, private readonly logger: Logger) {
    this._request = request;
  }

  get headers(): Headers {
    return this._request.headers;
  }

  get method(): string {
    return this.request.method;
  }

  get organization(): OrganizationRoles | undefined {
    return this._organization;
  }

  get request(): Request {
    return this._request;
  }

  get state(): AuthState | undefined {
    return this._state;
  }

  get url(): string {
    return this.request.url;
  }

  setState(state: AuthState): void {
    this._state = state;
  }

  setOrganization(organization: OrganizationRoles): void {
    this._organization = organization;

    this.services.data.setOrganization(organization.organization);
  }

  logException(message: string, location: string, err: Error): void {
    console.log(message);
    console.log(location);
    console.log(err);
    console.log(err?.stack?.toString());
    this.logger.trackException(message, location, err);
  }

  myFetch(input: string | Request, init?: RequestInit): Promise<Response> {
    return myFetch(this.request, this.logger, input, init);
  }
}
