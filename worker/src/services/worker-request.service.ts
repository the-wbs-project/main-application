import { Obj } from 'itty-router';
import { User } from '../models';
import { DataServiceFactory } from './data-services';
import { DbFactory } from './database-services';
import { EdgeService } from './edge-services';
import { myFetch } from './fetcher.service';
import { Logger } from './logger.service';

export class WorkerRequest {
  private readonly _data: DataServiceFactory;
  private _request: Request;
  private _user: User | undefined;
  private _sessionId: string | undefined;
  isAuthenticated: boolean | undefined;
  params: Obj | undefined;
  //token: TokenInfo | undefined;

  constructor(
    event: FetchEvent,
    dbFactory: DbFactory,
    readonly edge: EdgeService,
    private readonly logger: Logger,
  ) {
    this._request = event.request;
    this._data = new DataServiceFactory(dbFactory, edge);
  }

  get data(): DataServiceFactory {
    return this._data;
  }

  get request(): Request {
    return this._request;
  }

  get sessionId(): string | undefined {
    return this._sessionId;
  }

  get user(): User | undefined {
    return this._user;
  }

  get url(): string {
    return this.request.url;
  }

  get method(): string {
    return this.request.method;
  }

  setUser(user: User, sessionId: string): void {
    this._user = user;
    this._sessionId = sessionId;
  }

  logException(message: string, location: string, err: Error): void {
    console.log(message);
    console.log(location);
    console.log(err);
    this.logger.trackException(this.request, message, location, err);
  }

  myFetch(input: string | Request, init?: RequestInit): Promise<Response> {
    return myFetch(this.request, this.logger, input, init);
  }
}
