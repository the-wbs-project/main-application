import { Config } from '../config';
import { AuthState, OrganizationRoles } from '../models';
import { ServiceFactory } from './factory.service';
import { myFetch } from './fetcher.service';
import { Logger } from './logger.service';

export class WorkerContext {
  private _state?: AuthState;
  private _organization?: OrganizationRoles;

  constructor(readonly config: Config, readonly services: ServiceFactory, private readonly logger: Logger) {}

  get organization(): OrganizationRoles | undefined {
    return this._organization;
  }

  get state(): AuthState | undefined {
    return this._state;
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

  myFetch(mainRequest: Request | undefined, input: string | Request, init?: RequestInit): Promise<Response> {
    return myFetch(mainRequest, this.logger, input, init);
  }
}
