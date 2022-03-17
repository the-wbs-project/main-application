import { Config } from '../config';
import { HttpServiceFactory } from './http-services/';
import { MailGunService } from './mail-gun.service';
import { RouterService } from './router.service';

export class ServiceFactory {
  private readonly _http: HttpServiceFactory;
  private readonly _mailgun: MailGunService;
  private readonly _router: RouterService;

  constructor(readonly config: Config) {
    this._http = new HttpServiceFactory(config);
    this._mailgun = new MailGunService(config.mailgun);
    this._router = new RouterService(config, this.mailgun, this.http);
  }

  get http(): HttpServiceFactory {
    return this._http;
  }

  get mailgun(): MailGunService {
    return this._mailgun;
  }

  get router(): RouterService {
    return this._router;
  }
}
