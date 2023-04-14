import { Config } from '../config';
import { Auth0Service, IdentityService } from './auth-services';
import { DataServiceFactory } from './data-services';
import { EdgeService } from './edge-services';
import { MailGunService } from './mail-gun.service';
import { RouterService } from './router.service';
import { StorageFactory } from './storage-services';

export class ServiceFactory {
  readonly identity: IdentityService;
  readonly mailgun: MailGunService;
  readonly router: RouterService;

  constructor(readonly config: Config, readonly data: DataServiceFactory, readonly edge: EdgeService, readonly storage: StorageFactory) {
    const auth0 = new Auth0Service(config.auth);

    this.mailgun = new MailGunService(config);
    this.router = new RouterService(this.mailgun);
    this.identity = new IdentityService(auth0, config);
  }
}
