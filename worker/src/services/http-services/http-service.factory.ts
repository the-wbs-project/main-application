import { Config } from '../../config';
import { ProjectHttpService } from './project.http-service';
import { SiteHttpService } from './site.http-service';

export class HttpServiceFactory {
  private readonly _project: ProjectHttpService;
  private readonly _site: SiteHttpService;

  constructor(
    //auth0: Auth0Service,
    //auth: AuthenticationService,
    config: Config,
    //twilio: TwilioService,
  ) {
    this._project = new ProjectHttpService(config);
    this._site = new SiteHttpService(config);
  }

  get project(): ProjectHttpService {
    return this._project;
  }

  get site(): SiteHttpService {
    return this._site;
  }
}
