import { Config } from '../config';
import { MailGunService } from './mail-gun.service';
import { RouterService } from './router.service';

export class ServiceFactory {
  readonly mailgun: MailGunService;
  readonly router: RouterService;

  constructor(readonly config: Config) {
    this.mailgun = new MailGunService(config.mailgun);
    this.router = new RouterService(config, this.mailgun);
  }
}
